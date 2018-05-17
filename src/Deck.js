import React from 'react';
import { Animated, View } from 'react-native';

export default class Deck extends React.Component {
  _renderCards() {
    return this.props.data.map(this.props.renderCard);
  }

  render() {
    return (
      <View>
        { this._renderCards() }
      </View>
    );
  }
}
