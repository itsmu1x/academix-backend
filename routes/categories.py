from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from fastapi import APIRouter, Depends
from models.category import Cateogry
from sqlalchemy import select
from core.db import get_db
from schemas.categories import CategoryOut

router = APIRouter(prefix="/categories", tags=["categories"])

@router.get("")
async def get_categories(db: AsyncSession = Depends(get_db)):
    stmt = select(Cateogry).options(selectinload(Cateogry.translations))
    result = await db.execute(stmt)
    categories = result.scalars().all()

    return [CategoryOut.from_orm_with_translations(category) for category in categories]