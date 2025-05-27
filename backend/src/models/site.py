from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, select
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from sqlalchemy.ext.asyncio import AsyncSession
from backend.database.base import Base

class Site(Base):
    __tablename__ = "sites"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    domain = Column(String, unique=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    user = relationship("User", back_populates="sites")
    events = relationship("AnalyticsEvent", back_populates="site")

    @classmethod
    async def get_by_domain(cls, db: AsyncSession, domain: str) -> "Site":
        """Get site by domain"""
        stmt = select(cls).where(cls.domain == domain)
        result = await db.execute(stmt)
        return result.scalar_one_or_none()

    @classmethod
    async def create_if_not_exists(cls, db: AsyncSession, user_id: int, domain: str) -> "Site":
        """Create site if it doesn't exist"""
        # Try to get existing site
        site = await cls.get_by_domain(db, domain)
        
        if not site:
            # Create new site
            site = cls(
                name=f"Site {domain}",
                domain=domain,
                user_id=user_id
            )
            db.add(site)
            await db.commit()
            await db.refresh(site)
        
        return site 