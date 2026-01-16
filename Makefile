# Makefile

.PHONY: install dev build start lint db-push db-migrate db-studio db-generate help

install:
	yarn install

dev:
	yarn dev

build:
	yarn build

start:
	yarn start

lint:
	yarn lint

push:
	yarn prisma db push

migrate:
	yarn prisma migrate dev

migration:
	yarn prisma migrate dev --name $(name)

studio:
	yarn prisma studio

generate:
	yarn prisma generate

help:
	@echo "Available commands:"
	@echo "  make install      - Install dependencies"
	@echo "  make dev          - Run development server"
	@echo "  make build        - Build the project"
	@echo "  make start        - Start production server"
	@echo "  make lint         - Run linting"
	@echo "  make db-push      - Push Prisma schema to database (prototyping)"
	@echo "  make db-migrate   - Create and apply Prisma migration (development)"
	@echo "  make db-create-migration name=<name> - Create a new migration with a specific name"
	@echo "  make db-studio    - Open Prisma Studio"
	@echo "  make db-generate  - Generate Prisma Client"
