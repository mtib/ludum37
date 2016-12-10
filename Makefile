deps:
	curl -o pixijs.min.js http://pixijs.download/v4.2.3/pixi.min.js 
	curl -o pixijs.min.js.map http://pixijs.download/v4.2.3/pixi.min.js.map

run: deps
	php -S localhost:3737

