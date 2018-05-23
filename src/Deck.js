import React from 'react';
import { Animated, Dimensions, PanResponder, View } from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SWIPE_THRESHOLD = SCREEN_WIDTH / 4;

export default class Deck extends React.Component {
  static defaultProps = {
    onSwipeLeft: () => {},
    onSwipeRight: () => {},
    renderNoMoreCards: () => {},
  };

  constructor(props) {
    super(props);

    this.state = { index: 0 };

    this._position = new Animated.ValueXY();

    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (event, gesture) => {
        this._position.setValue({ x: gesture.dx, y: gesture.dy });
      },
      onPanResponderRelease: (event, gesture) => {
        if (gesture.dx > SWIPE_THRESHOLD) {
          this._forceSwipe('right');
        } else if (gesture.dx < -SWIPE_THRESHOLD) {
          this._forceSwipe('left');
        } else {
          this._resetPosition();
        }
      },
    });
  }

  render() {
    return (
      <View>
        { this._renderCards() }
      </View>
    );
  }

  _forceSwipe(direction) {
    const x = direction === 'right' ? SCREEN_WIDTH : -SCREEN_WIDTH;

    Animated.timing(this._position, {
      duration: 250,
      toValue: { x, y: 0 },
    }).start(() => this._onSwipeComplete(direction));
  }

  _getCardStyle() {
    const { _position } = this;
    const rotate = _position.x.interpolate({
      inputRange: [-SCREEN_WIDTH, 0, SCREEN_WIDTH],
      outputRange: ['-90deg', '0deg', '90deg'],
    });

    return {
      ..._position.getLayout(),
      transform: [{ rotate }],
    };
  }

  _onSwipeComplete(direction) {
    const { data, onSwipeLeft, onSwipeRight } = this.props;
    const item = data[this.state.index];

    if (direction === 'right') {
      onSwipeRight(item);
    } else {
      onSwipeLeft(item);
    }

    this._position.setValue({ x: 0, y: 0 });
    this.setState({ index: this.state.index + 1 });
  }

  _renderCards() {
    if (this.state.index >= this.props.data.length) {
      return this.props.renderNoMoreCards();
    }

    return this.props.data.map((item, index) => {
      if (index === this.state.index) {
        return (
          <Animated.View
            key={ item.id }
            style={ this._getCardStyle() }
            { ...this._panResponder.panHandlers }
          >
            { this.props.renderCard(item) }
          </Animated.View>
        );
      } else if (index > this.state.index) {
        return this.props.renderCard(item);
      }
    });
  }

  _resetPosition() {
    Animated.timing(this._position, {
      duration: 250,
      toValue: { x: 0, y: 0 },
    }).start();
  }
}
