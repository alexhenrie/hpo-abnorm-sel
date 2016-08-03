var abnormalities = require('./abnormalities.js');
var React = require('react');
var ReactDOM = require('react-dom');

var TermBox = React.createClass({
    getInitialState: function() {
        var childCodes = [];
        Object.keys(abnormalities).forEach(function(code) {
            if (abnormalities[code].parents.includes(this.props.code)) {
                childCodes.push(code);
            }
        }.bind(this));

        return {
            childCodes: childCodes,
        };
    },

    render: function() {
        var termBoxClass = 'term';
        if (this.state.childCodes && this.state.childCodes.length) {
            if (this.state.expanded) {
                termBoxClass += ' expanded';
            } else {
                termBoxClass += ' collapsed';
            }
        }
        return (
            <div className={termBoxClass}>
                <div className="self">
                    <span className="buttons">
                        <span className="expander" onClick={this.expandOrCollapse}/>
                        <input
                            checked={this.props.getSelection(this.props.code) == undefined}
                            id={this.props.name + '-na'}
                            name={this.props.name}
                            onChange={this.setSelection.bind(null, undefined)}
                            type="radio"
                        />
                        <label className="na" htmlFor={this.props.name + '-na'}>NA</label>
                        <input
                            checked={this.props.getSelection(this.props.code) == true}
                            id={this.props.name + '-y'}
                            name={this.props.name}
                            onChange={this.setSelection.bind(null, true)}
                            type="radio"
                        />
                        <label className="y" htmlFor={this.props.name + '-y'}>Y</label>
                        <input
                            checked={this.props.getSelection(this.props.code) == false}
                            id={this.props.name + '-n'}
                            name={this.props.name}
                            onChange={this.setSelection.bind(null, false)}
                            type="radio"
                        />
                        <label className="n" htmlFor={this.props.name + '-n'}>N</label>
                    </span>
                    <span className="desc">
                        {abnormalities[this.props.code].name}
                        <span className="info-button" onClick={this.popUpInfo}/>
                    </span>
                </div>
                {
                    this.state.expanded ? this.state.childCodes.map(function(code) {
                        return (
                            <TermBox
                                {...this.props}
                                code={code}
                                key={this.props.name + '-' + code}
                                name={this.props.name + '-' + code}
                            />
                        )
                    }.bind(this)) : null
                }
            </div>
        );
    },

    expandOrCollapse: function() {
        this.setState({expanded: !this.state.expanded});
    },

    setSelection: function(value) {
        this.props.setSelection(this.props.code, value, this.props.isSuggestion);
    },

    popUpInfo: function() {
        var longDesc = this.props.code + ' ' + abnormalities[this.props.code].name;
        if (abnormalities[this.props.code].def)
            longDesc += '\n\n' + abnormalities[this.props.code].def;
        if (abnormalities[this.props.code].synonyms)
            longDesc += '\n\nAlso known as\n' + abnormalities[this.props.code].synonyms.join('\n');
        longDesc += '\n\nIs a type of';
        abnormalities[this.props.code].parents.forEach(function(code) {
            if (code in abnormalities) {
                longDesc += '\n' + abnormalities[code].name;
            }
        }.bind(this));
        alert(longDesc);
    }
});

module.exports = TermBox;
