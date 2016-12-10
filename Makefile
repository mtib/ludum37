deps:
	curl -o pixi.min.js http://pixijs.download/v4.2.3/pixi.min.js
	curl -o pixi.min.js.map http://pixijs.download/v4.2.3/pixi.min.js.map
	curl -o howler.min.js https://cdnjs.cloudflare.com/ajax/libs/howler/2.0.2/howler.min.js

run: deps
	php -S localhost:3737
