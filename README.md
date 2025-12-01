# Chidhvi's Chess

A simple browser-based chess game built with **HTML, CSS, and JavaScript**.

## Prerequisites

- Docker
- Docker Compose
- A Kubernetes cluster (tested with kind)
- `kubectl` configured to talk to your cluster

## Features

- **Interactive chessboard**
  - 8×8 grid rendered with CSS Grid
  - Click pieces and destination squares to move
- **Piece movement rules**
  - Pawns (including initial 2-step moves and diagonal captures)
  - Rooks, bishops, queens (sliding moves)
  - Knights (L-shaped moves)
  - Kings (1 square in any direction)
- **Turn-based play**
  - White moves first, then Black, alternating turns
- **Check, checkmate, stalemate**
  - Moves that leave your own king in check are not allowed
  - Detects when the opposing king is in check
  - Detects checkmate (no legal moves while in check)
  - Detects stalemate (no legal moves but not in check)
- **Visuals**
  - Dark-themed board with light/dark squares
  - Unicode chess symbols for pieces (♔♕♖♗♘♙ and ♚♛♜♝♞♟)
  - High-contrast styling so white and black pieces are easy to see
  - Highlight for the selected piece and its legal target squares
- **Controls**
  - "New Game" button to reset the board
  - Turn indicator showing whose move it is (and if the side is in check)

## Running with Docker

### Build the image

From the project root:

```bash
docker build -t chidhvis-chess:latest .
```

The Kubernetes manifests expect an image named `chidhvilas/chidhvis-chess:1.0.0`. To build and tag that image:

```bash
docker build -t chidhvilas/chidhvis-chess:1.0.0 .
```

Then push it to Docker Hub (you must be logged in and own the `chidhvilas` namespace):

```bash
docker push chidhvilas/chidhvis-chess:1.0.0
```

### Run the container

```bash
docker run -d --name chidhvis-chess -p 8080:80 chidhvis-chess:latest
```

Then open:

```text
http://localhost:8080
```

To stop and remove the container:

```bash
docker stop chidhvis-chess
docker rm chidhvis-chess
```

### Using Docker Compose

You can also run the app using `docker-compose.yml` in this folder.

Start in detached mode:

```bash
docker compose up -d
```

Stop and clean up:

```bash
docker compose down
```

## Running on Kubernetes (kind)

This project includes Kubernetes manifests under the `k8s/` directory for deployment to a kind cluster.

### Prerequisites

- A running [kind](https://kind.sigs.k8s.io/) cluster
- `kubectl` configured to talk to that cluster

### Apply the manifests

From the project root:

```bash
kubectl apply -f k8s
```

This will create:

- A `Deployment` named `chidhvis-chess`
- A `NodePort` `Service` named `chidhvis-chess` exposing port `80` (NodePort `30080`)

### Accessing the app

Because this is running on kind, the simplest way to access the service from your host is via `kubectl port-forward`:

```bash
kubectl port-forward service/chidhvis-chess 8080:80
```

Then open:

```text
http://localhost:8080
```

Leave the port-forward command running while you use the app.



<img width="1348" height="943" alt="image" src="https://github.com/user-attachments/assets/2b1d3c84-f53e-42ab-8333-ed60dcdbad4a" />

