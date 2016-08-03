var abnormalities = require('./abnormalities.js');
var codes = Object.keys(abnormalities).sort();
var React = require('react');
var ReactDOM = require('react-dom');
var TermBox = require('./term-box.jsx');

module.exports = React.createClass({
    getInitialState: function() {
        return {
            selections: [],
            suggestions: [],
        };
    },

    render: function() {
        return (
            <div className="hpo-sel">
                <div className="shop">
                    <table className="search">
                        <tbody>
                            <tr>
                                <td className="search-icon" rowSpan="2"></td>
                                <td className="search-instructions">Quick phenotype search:</td>
                            </tr>
                            <tr>
                                <td>
                                    <input
                                        onChange={this.makeSuggestions}
                                        onFocus={this.showSuggestions}
                                        placeholder="Enter keywords and choose from the suggested ontology terms"
                                        ref="searchBox"
                                    />
                                    <div className="search-suggestions" ref="suggestionsBox">
                                        {
                                            this.state.suggestions.map(function(code) {
                                                return (
                                                    <TermBox
                                                        code={code}
                                                        key={'suggestion-' + code}
                                                        isSuggestion={true}
                                                        name={'suggestion-' + code}
                                                        getSelection={this.getSelection}
                                                        setSelection={this.setSelection}
                                                    />
                                                );
                                            }.bind(this))
                                        }
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div className="cart">
                    <div className="cart-header">Current selection</div>
                    <button className="save-button" onClick={this.save}>
                        Save
                    </button>
                    {
                        this.state.selections.map(function(selection) {
                            return (
                                <TermBox
                                    code={selection.code}
                                    key={'selection-' + selection.code}
                                    name={'selection-' + selection.code}
                                    getSelection={this.getSelection}
                                    setSelection={this.setSelection}
                                />
                            );
                        }.bind(this))
                    }
                </div>
            </div>
        );
    },

    componentDidMount: function() {
        this.refs.searchBox.focus();
    },

    getSelection: function(code) {
        for (var i = 0; i < this.state.selections.length; i++) {
            if (this.state.selections[i].code == code) {
                return this.state.selections[i].value;
            }
        }
        return undefined;
    },

    setSelection: function(code, value, fromSuggestion) {
        var selections = this.state.selections;
        if (value == undefined) {
            selections = selections.filter(function(selection) {
                return selection.code != code;
            }.bind(this));
        } else {
            for (var i = 0; i < selections.length; i++) {
                if (selections[i].code == code) break;
            }
            selections[i] = {code: code, value: value};
        }
        this.setState({selections: selections});

        if (fromSuggestion) {
            this.setState({suggestions: []});
            this.refs.searchBox.value = '';
            this.refs.searchBox.focus();
        }
    },

    makeSuggestions: function() {
        var query = this.refs.searchBox.value.toLowerCase();
        var suggestions = [];

        if (query) {
            for (var i = 0; i < codes.length; i++) {
                if (abnormalities[codes[i]].name.toLowerCase().indexOf(query) == -1) {
                    continue;
                }

                if (this.state.selections.includes(codes[i])) {
                    continue;
                }

                suggestions.push(codes[i]);

                if (suggestions.length == 10) {
                    break;
                }
            }
        }

        this.setState({suggestions: suggestions});
    },

    showSuggestions: function() {
        this.refs.suggestionsBox.style.display = 'block';
    },

    hideSuggestions: function() {
        this.refs.suggestionsBox.style.display = 'none';
    },

    save: function() {
        this.props.saveFunction(this.state.selections);
    },
});
