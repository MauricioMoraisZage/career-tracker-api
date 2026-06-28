COMPOSE = docker compose

.DEFAULT_GOAL := help

.PHONY: help up build rebuild down restart logs ps test clean

help:
	@echo "Career Tracker API - comandos disponíveis:"
	@echo ""
	@echo "  make up        Sobe os containers em segundo plano"
	@echo "  make build     Constrói as imagens Docker"
	@echo "  make rebuild   Reconstrói e sobe os containers"
	@echo "  make down      Para e remove os containers"
	@echo "  make restart   Reinicia os containers"
	@echo "  make logs      Mostra os logs em tempo real"
	@echo "  make ps        Mostra o estado dos containers"
	@echo "  make test      Executa build e testes da aplicação"
	@echo "  make clean     Remove containers, redes e volume do banco"
	@echo ""
	@echo "Atenção: make clean apaga os dados locais do PostgreSQL."

up:
	$(COMPOSE) up -d

build:
	$(COMPOSE) build

rebuild:
	$(COMPOSE) up --build -d

down:
	$(COMPOSE) down

restart:
	$(COMPOSE) down
	$(COMPOSE) up -d

logs:
	$(COMPOSE) logs -f

ps:
	$(COMPOSE) ps

test:
	pnpm build
	pnpm test

clean:
	$(COMPOSE) down -v --remove-orphans
