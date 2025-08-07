from fastapi.exceptions import HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from fastapi import APIRouter, Depends
from core.config import settings
from models.category import Cateogry, CateogryTranslation
from sqlalchemy import select
from core.db import get_db
from schemas.categories import CategoryIn, CategoryOut

router = APIRouter(prefix="/categories", tags=["categories"])

@router.get("")
async def get_categories(db: AsyncSession = Depends(get_db)):
    stmt = select(Cateogry).options(selectinload(Cateogry.translations))
    result = await db.execute(stmt)
    categories = result.scalars().all()

    return [CategoryOut.from_orm_with_translations(category) for category in categories]

@router.post("")
async def create_category(payload: CategoryIn, db: AsyncSession = Depends(get_db)):
    missing_locales = [locale for locale in settings.SUPPORTED_LANGUAGES if locale not in payload.translations]
    if missing_locales:
        raise HTTPException(status_code=400, detail=f"Missing translations for locales: {', '.join(missing_locales)}")

    invalid_locales = [locale for locale in payload.translations.keys() if locale not in settings.SUPPORTED_LANGUAGES]
    if invalid_locales:
        raise HTTPException(status_code=400, detail=f"Invalid locales: {', '.join(invalid_locales)}")
    
    category = Cateogry(slug=payload.slug)
    db.add(category)
    await db.flush()

    for locale, translation in payload.translations.items():
        category_translation = CateogryTranslation(
            category_id=category.id,
            locale=locale,
            name=translation.name
        )
        db.add(category_translation)

    await db.commit()
    await db.refresh(category, ["translations"])

    return CategoryOut.from_orm_with_translations(category)