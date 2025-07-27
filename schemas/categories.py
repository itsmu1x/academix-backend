from datetime import datetime
from typing import Dict
from pydantic import BaseModel

class CategoryTranslationOut(BaseModel):
    name: str

class CategoryOut(BaseModel):
    id: int
    slug: str
    created_at: datetime
    updated_at: datetime
    translations: Dict[str, CategoryTranslationOut]

    @classmethod
    def from_orm_with_translations(cls, category):
        return cls(
            id=category.id,
            slug=category.slug,
            created_at=category.created_at,
            updated_at=category.updated_at,
            translations={
                t.locale: CategoryTranslationOut(id=t.id, name=t.name)
                for t in category.translations
            }
        )