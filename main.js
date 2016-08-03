var React = require('react');
var ReactDOM = require('react-dom');
var Selector = require('./selector.jsx');
require('./main.css');

module.exports = function(root, saveFunction) {
    ReactDOM.render(
        React.createElement(Selector, {saveFunction: saveFunction}),
        root
    );
}
