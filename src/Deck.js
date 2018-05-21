import React from 'react';
import { Animated, PanResponder, View } from 'react-native';

export default class Deck extends React.Component {
  constructor(props) {
    super(props);

    this._position = new Animated.ValueXY();

    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (event, gesture) => {
        this._position.setValue({ x: gesture.dx, y: gesture.dy });
      },
      onPanResponderRelease: () => {},
    });
  }

  _renderCards() {
    return this.props.data.map((item, index) => {
      if (index === 0) {
        return (
          <Animated.View
            key={ item.id }
            style={ this._position.getLayout() }
            { ...this._panResponder.panHandlers }
          >
            { this.props.renderCard(item) }
          </Animated.View>
        );
      }

      return this.props.renderCard(item);
    });
  }

  render() {
    return (
      <View>
        { this._renderCards() }
      </View>
    );
  }
}
