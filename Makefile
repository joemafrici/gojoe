.PHONY: dev
dev:
	./tailwindcss -i ./static/css/input.css -o ./static/css/tailwind.css --watch &
	air
