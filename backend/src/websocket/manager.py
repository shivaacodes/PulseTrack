from typing import Dict, Set, List
from fastapi import WebSocket
from datetime import datetime, timedelta
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class ConnectionManager:
    def __init__(self):
        # Dictionary to store active connections with their IDs
        self.active_connections: Dict[str, WebSocket] = {}
        # Set to store all active connection IDs
        self.connection_ids: Set[str] = set()
        # Dictionary to store click data for each site
        self.click_counts: Dict[str, List[dict]] = {}

    async def connect(self, websocket: WebSocket, client_id: str):
        """Connect a new client and store their connection"""
        await websocket.accept()
        self.active_connections[client_id] = websocket
        self.connection_ids.add(client_id)
        logger.info(f"Client {client_id} connected. Total connections: {len(self.active_connections)}")

    def disconnect(self, client_id: str):
        """Remove a client's connection"""
        if client_id in self.active_connections:
            del self.active_connections[client_id]
            self.connection_ids.remove(client_id)
            logger.info(f"Client {client_id} disconnected. Total connections: {len(self.active_connections)}")

    async def send_personal_message(self, message: str, client_id: str):
        """Send a message to a specific client"""
        if client_id in self.active_connections:
            await self.active_connections[client_id].send_text(message)
            logger.info(f"Sent message to client {client_id}: {message[:100]}...")

    async def broadcast(self, message: str):
        """Send a message to all connected clients"""
        for connection in self.active_connections.values():
            await connection.send_text(message)
        logger.info(f"Broadcasted message to {len(self.active_connections)} clients: {message[:100]}...")

    async def broadcast_except(self, message: str, exclude_client_id: str):
        """Send a message to all clients except the specified one"""
        for client_id, connection in self.active_connections.items():
            if client_id != exclude_client_id:
                await connection.send_text(message)
        logger.info(f"Broadcasted message to {len(self.active_connections)-1} clients (excluding {exclude_client_id}): {message[:100]}...")

    def record_click(self, site_id: str) -> List[dict]:
        """Record a click for a site and return updated click data"""
        now = datetime.utcnow()
        time_str = now.strftime('%H:%M:%S')
        
        # Initialize click data for new sites
        if site_id not in self.click_counts:
            self.click_counts[site_id] = []
        
        # Find or create entry for current time
        current_entry = next(
            (entry for entry in self.click_counts[site_id] if entry['time'] == time_str),
            None
        )
        
        if current_entry:
            current_entry['clicks'] += 1
        else:
            # Add new entry
            self.click_counts[site_id].append({
                'time': time_str,
                'clicks': 1
            })
            
            # Remove old entries (keep last 20 entries)
            if len(self.click_counts[site_id]) > 20:
                self.click_counts[site_id] = self.click_counts[site_id][-20:]
        
        # Sort by time
        result = sorted(
            self.click_counts[site_id],
            key=lambda x: x['time']
        )
        
        logger.info(f"Updated click data for site {site_id}: {result}")
        return result

# Create a global instance of the connection manager
manager = ConnectionManager() 