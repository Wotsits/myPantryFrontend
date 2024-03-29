import React, {useRef} from 'react'
import {StyleSheet, Dimensions, PanResponder, Animated} from 'react-native'
import { FontAwesome } from '@expo/vector-icons';
import { stylesColors } from '../../styleObjects';

const FloatingButton = ({onPress}) => {

    // ---------------------
    // State Declarations
    // ---------------------

    // animation handling for the ability to drag the button around.
    const pan = useRef(new Animated.ValueXY()).current;
    const panResponder = useRef(
        PanResponder.create({
          onMoveShouldSetPanResponder: () => true,
          onPanResponderMove: Animated.event([null, {dx: pan.x, dy: pan.y}], {useNativeDriver: false}),
          onPanResponderRelease: () => {
            pan.extractOffset();
          },
        }),
      ).current;

    // ---------------------
    // Render
    // ---------------------

    return (
        <Animated.View style={{...styles.floatingButton, transform: [{translateX: pan.x}, {translateY: pan.y}]}} {...panResponder.panHandlers}>
            <FontAwesome name="plus" size={50} onPress={onPress}/>
        </Animated.View>
    )
}

// ---------------------
// Style Definitions
// ---------------------

const styles = StyleSheet.create({
    floatingButton: {
        position: "absolute",
        justifyContent: "center",
        alignItems: "center",
        bottom: Dimensions.get('window').width * 0.05,
        right: Dimensions.get('window').width * 0.05,
        width: Dimensions.get('window').width * 0.25,
        height: Dimensions.get('window').width * 0.25,
        borderRadius: Dimensions.get('window').width * 0.25,
        backgroundColor: stylesColors.yellow,
        borderColor: stylesColors.borderColorDark,
        borderWidth: 2,
    }
})

export default FloatingButton