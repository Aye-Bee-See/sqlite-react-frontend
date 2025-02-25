import React from 'react';

class Item extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<>
				<li
					className={
						'list-group-item ' + (this.props.index === this.props.currentIndex ? 'active' : '')
					}
					onClick={() => this.props.settingFunction(this.props.individual, this.props.index)}
					key={this.props.index}
				>
					{this.props.individual[this.props.toDisplay]}
				</li>
			</>
		);
	}
}

export default Item;
