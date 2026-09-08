from pydantic import BaseModel, Field

class Ingestion(BaseModel):
    company_name: str = Field(..., min_length=1, description="The name of the company")
    company_website: str = Field(..., min_length=1, description="The website of the company")
    relevant_links_to_be_scraped: list[str] = Field(
        ...,
        min_length=1,
        description="The relevant links to be scraped",
    )

class WebsiteScrapeResult(BaseModel):
    url: str
    markdown: str
    description: str
    title: str

class SearchDTO(BaseModel):
    query: str = Field(..., min_length=1)
    company_website: str = Field(..., min_length=1)
    top_k: int = Field(default=3, ge=1, le=20)


class GeneratedIngestionRecord(BaseModel):
    summarized_content: str = Field(..., min_length=1)
    content_type: str = Field(..., min_length=1)
    title: str = Field(..., min_length=1)
    section: str = Field(..., min_length=1)
    specific_metadata: dict = Field(default_factory=dict)
    source_url: str = Field(..., min_length=1)
    company_name: str = Field(..., min_length=1)
    company_website: str = Field(..., min_length=1)

class IngestionData(BaseModel):
    content: str = Field(..., description="The actual text content")
    summarized_content: str = Field("", description="Summarized content of the chunk")
    vector_embedding: list[float] = Field(..., description="The embedding vector of the content")
    
    company_name: str = Field(..., description="From client API input")
    company_website: str = Field(..., description="From client API input")
    source_url: str = Field(..., description="The specific URL where this chunk was found")
    description: str = Field(..., description="The description of the website")
    content_type: str = Field(..., description="Categorization (e.g., 'FAQ', 'Project', 'Doctor Profile', 'Medical Department', 'General Info')")
    title: str = Field(..., description="Title or heading of the section this chunk belongs to")
    section: str = Field(..., description="Broader section or category within the source")
    
    specific_metadata: dict = Field(..., description="A dictionary for use-case specific attributes")
