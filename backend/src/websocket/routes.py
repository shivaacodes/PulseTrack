from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from typing import Optional
import json
import uuid
from datetime import datetime
import logging
import asyncio

from .manager import manager

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter()


@router.websocket("/ws/{client_id}")
async def websocket_endpoint(websocket: WebSocket, client_id: str):
    """WebSocket endpoint for real-time communication"""
    try:
        await manager.connect(websocket, client_id)

        # Send welcome message
        await manager.send_personal_message(
            json.dumps({
                "type": "connection",
                "message": "Connected successfully",
                "timestamp": datetime.utcnow().isoformat()
            }),
            client_id
        )

        # Send initial empty click data
        await manager.send_personal_message(
            json.dumps({
                "type": "analytics_update",
                "data": [{
                    "time": datetime.utcnow().strftime('%H:%M:%S'),
                    "clicks": 0
                }],
                "timestamp": datetime.utcnow().isoformat()
            }),
            client_id
        )

        try:
            while True:
                # Wait for messages from the client
                data = await websocket.receive_text()
                message_data = json.loads(data)
                logger.info(f"Received message: {message_data}")

                # Handle analytics events
                if message_data.get("type") == "analytics_event":
                    site_id = message_data.get("site_id")
                    event_name = message_data.get("name")

                    if site_id and event_name == "click":
                        logger.info(
                            f"Processing click event for site {site_id}")
                        # Get updated click data from manager
                        click_data = manager.record_click(str(site_id))
                        logger.info(f"Updated click data: {click_data}")

                        # Broadcast the analytics update to all clients
                        await manager.broadcast(
                            json.dumps({
                                "type": "analytics_update",
                                "data": click_data,
                                "timestamp": datetime.utcnow().isoformat()
                            })
                        )
                else:
                    # Handle regular messages
                    await manager.broadcast_except(
                        json.dumps({
                            "type": "message",
                            "client_id": client_id,
                            "message": data,
                            "timestamp": datetime.utcnow().isoformat()
                        }),
                        client_id
                    )

        except WebSocketDisconnect:
            manager.disconnect(client_id)
            # Notify other clients about the disconnection
            await manager.broadcast(
                json.dumps({
                    "type": "disconnect",
                    "client_id": client_id,
                    "message": "Client disconnected",
                    "timestamp": datetime.utcnow().isoformat()
                })
            )

    except Exception as e:
        # Handle any other exceptions
        logger.error(f"WebSocket error: {str(e)}")
        if client_id in manager.active_connections:
            manager.disconnect(client_id)
        raise e


@router.websocket("/ws")
async def websocket_endpoint_anonymous(websocket: WebSocket):
    """WebSocket endpoint for anonymous connections"""
    # Generate a random client ID for anonymous connections
    client_id = str(uuid.uuid4())
    await websocket_endpoint(websocket, client_id)


@router.websocket("/ws/analytics")
async def websocket_endpoint(websocket: WebSocket):
    site_id = "1"  # Default site ID for now
    await manager.connect(websocket, site_id)
    try:
        while True:
            # Send initial analytics data
            await manager.broadcast_analytics_update(site_id)
            
            # Wait for 30 seconds before next update
            await asyncio.sleep(30)
            
    except WebSocketDisconnect:
        manager.disconnect(websocket, site_id)
    except Exception as e:
        print(f"WebSocket error: {str(e)}")
        manager.disconnect(websocket, site_id)
