from pathlib import Path
from uuid import uuid4

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status
from fastapi.responses import FileResponse
from pydantic import BaseModel, ConfigDict
from sqlalchemy.orm import Session

from database.connection import get_db
from database.models import SiteAsset
from routes.auth import get_current_user

router = APIRouter(prefix="/api/site", tags=["site-assets"])
admin_router = APIRouter(prefix="/api/admin/site", tags=["admin-site-assets"])

ASSET_ROOT = Path(__file__).resolve().parents[1] / "data" / "site-assets"
ALLOWED_KEYS = {"logo", "favicon", "hero", "login"}
ALLOWED_MIME_TYPES = {"image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml", "image/x-icon"}
MAX_FILE_SIZE = 10 * 1024 * 1024


class SiteAssetResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    key: str
    filename: str
    mime_type: str
    size_bytes: int
    width: int | None = None
    height: int | None = None
    is_active: bool
    url: str


def require_admin(current_user=Depends(get_current_user)):
    if getattr(current_user, "role", None) != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin access required")
    return current_user


def asset_url(asset: SiteAsset) -> str:
    return f"/api/site/assets/{asset.id}"


def serialize_asset(asset: SiteAsset) -> SiteAssetResponse:
    return SiteAssetResponse(
        id=asset.id,
        key=asset.key,
        filename=asset.filename,
        mime_type=asset.mime_type,
        size_bytes=asset.size_bytes,
        width=asset.width,
        height=asset.height,
        is_active=asset.is_active,
        url=asset_url(asset),
    )


@router.get("/assets/{asset_id}")
def serve_asset(asset_id: int, db: Session = Depends(get_db)):
    asset = db.query(SiteAsset).filter(SiteAsset.id == asset_id, SiteAsset.is_active.is_(True)).first()
    if asset is None:
        raise HTTPException(status_code=404, detail="Asset not found")

    path = Path(asset.storage_path).resolve()
    root = ASSET_ROOT.resolve()
    if root not in path.parents:
        raise HTTPException(status_code=404, detail="Asset not found")
    if not path.is_file():
        raise HTTPException(status_code=404, detail="Asset file not found")

    return FileResponse(path, media_type=asset.mime_type, filename=asset.filename)


@admin_router.get("/assets", response_model=list[SiteAssetResponse])
def list_assets(
    db: Session = Depends(get_db),
    _admin=Depends(require_admin),
):
    assets = db.query(SiteAsset).filter(SiteAsset.is_active.is_(True)).order_by(SiteAsset.key.asc(), SiteAsset.id.desc()).all()
    return [serialize_asset(asset) for asset in assets]


@admin_router.post("/assets", response_model=SiteAssetResponse, status_code=status.HTTP_201_CREATED)
async def upload_asset(
    key: str,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    _admin=Depends(require_admin),
):
    key = key.strip().lower()
    if key not in ALLOWED_KEYS:
        raise HTTPException(status_code=400, detail=f"Unsupported asset key. Allowed: {sorted(ALLOWED_KEYS)}")

    if file.content_type not in ALLOWED_MIME_TYPES:
        raise HTTPException(status_code=400, detail="Unsupported image type")

    content = await file.read(MAX_FILE_SIZE + 1)
    if len(content) > MAX_FILE_SIZE:
        raise HTTPException(status_code=413, detail="Image exceeds 10 MB limit")
    if not content:
        raise HTTPException(status_code=400, detail="Image file is empty")

    extension = Path(file.filename or "upload").suffix.lower()
    if extension not in {".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg", ".ico"}:
        raise HTTPException(status_code=400, detail="Unsupported image extension")

    ASSET_ROOT.mkdir(parents=True, exist_ok=True)
    target = ASSET_ROOT / f"{uuid4().hex}{extension}"
    target.write_bytes(content)

    previous = db.query(SiteAsset).filter(SiteAsset.key == key, SiteAsset.is_active.is_(True)).all()
    for asset in previous:
        asset.is_active = False

    asset = SiteAsset(
        key=key,
        filename=Path(file.filename or target.name).name,
        mime_type=file.content_type,
        storage_path=str(target),
        size_bytes=len(content),
        is_active=True,
    )
    db.add(asset)
    db.commit()
    db.refresh(asset)
    return serialize_asset(asset)


@admin_router.delete("/assets/{asset_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_asset(
    asset_id: int,
    db: Session = Depends(get_db),
    _admin=Depends(require_admin),
):
    asset = db.query(SiteAsset).filter(SiteAsset.id == asset_id).first()
    if asset is None:
        raise HTTPException(status_code=404, detail="Asset not found")

    asset.is_active = False
    db.add(asset)
    db.commit()

    path = Path(asset.storage_path)
    try:
        path.unlink(missing_ok=True)
    except OSError:
        pass

    return None
