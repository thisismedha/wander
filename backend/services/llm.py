import os
from typing import Optional

import vertexai
from dotenv import load_dotenv
from google.oauth2 import service_account
from langchain_core.messages import HumanMessage, SystemMessage
from langchain_core.prompts import ChatPromptTemplate
from langchain_google_vertexai import ChatVertexAI

from backend.models.explore import ExploreSuggestions
from backend.models.itinerary import Itinerary
from backend.prompts.explore import EXPLORE_SYSTEM_PROMPT, build_explore_prompt
from backend.prompts.itinerary import SYSTEM_PROMPT, build_tweak_prompt, build_user_prompt

load_dotenv()

_credentials = service_account.Credentials.from_service_account_file(
    os.getenv("GOOGLE_APPLICATION_CREDENTIALS"),
    scopes=["https://www.googleapis.com/auth/cloud-platform"],
)

vertexai.init(
    project=os.getenv("GCP_PROJECT_ID"),
    location=os.getenv("GCP_LOCATION", "us-central1"),
    credentials=_credentials,
)


class ItineraryService:
    def __init__(self, model: str = "gemini-2.5-flash"):
        llm = ChatVertexAI(
            model_name=model,
            temperature=0,
            project=os.getenv("GCP_PROJECT_ID"),
            location=os.getenv("GCP_LOCATION", "us-central1"),
            credentials=_credentials,
        )
        self.structured_llm = llm.with_structured_output(Itinerary)
        self.explore_llm = llm.with_structured_output(ExploreSuggestions)

    async def generate(
        self,
        destination: Optional[str],
        duration: str,
        style: str,
        budget: str,
        nationality: Optional[str],
    ) -> Itinerary:
        prompt = ChatPromptTemplate.from_messages([
            ("system", SYSTEM_PROMPT),
            ("human", build_user_prompt(destination, duration, style, budget, nationality)),
        ])
        chain = prompt | self.structured_llm
        return await chain.ainvoke({})

    async def explore(
        self,
        duration: str,
        style: str,
        budget: str,
        nationality: Optional[str],
    ) -> ExploreSuggestions:
        messages = [
            SystemMessage(content=EXPLORE_SYSTEM_PROMPT),
            HumanMessage(content=build_explore_prompt(duration, style, budget, nationality)),
        ]
        return await self.explore_llm.ainvoke(messages)

    async def tweak(
        self,
        current_itinerary: Itinerary,
        original_inputs: dict,
        instruction: str,
    ) -> Itinerary:
        # Use messages directly — ChatPromptTemplate would misparse the JSON's {} as template vars
        messages = [
            SystemMessage(content=SYSTEM_PROMPT),
            HumanMessage(content=build_tweak_prompt(current_itinerary, original_inputs, instruction)),
        ]
        return await self.structured_llm.ainvoke(messages)
