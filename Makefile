ifeq "$(MAKECMDGOALS)" "debug"
	WEBPACKFLAGS = -d
	BUILD_TYPE = debug
else
	WEBPACKFLAGS = -p
	BUILD_TYPE = release
endif

all: $(BUILD_TYPE)/hpo-abnorm-sel.js $(BUILD_TYPE)/demo.html

debug: all

release: all

clean:
	rm -rf node_modules
	rm -f hp.obo
	rm -rf debug release

.PHONY: clean

hp.obo:
	wget http://purl.obolibrary.org/obo/hp.obo

abnormalities.js: hp.obo
	./jsonify-abnormalities.py

node_modules:
	npm install

$(BUILD_TYPE)/demo.html: demo.html
	cp demo.html $(BUILD_TYPE)

$(BUILD_TYPE)/hpo-abnorm-sel.js: node_modules *.js *.jsx *.css
	BUILD_TYPE=$(BUILD_TYPE) ./node_modules/webpack/bin/webpack.js $(WEBPACKFLAGS)
