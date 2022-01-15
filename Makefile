.EXPORT_ALL_VARIABLES:

NODE_DEBUG = app

dev:
	yarn run nodemon --experimental-specifier-resolution=node index.mjs

run:
	node --experimental-specifier-resolution=node index.mjs

.PHONY: run
