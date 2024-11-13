import React, {useEffect} from 'react';
import {View, StyleSheet} from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    withDelay,
    runOnJS,
} from 'react-native-reanimated';

const DURATION = 5000; // Increased duration to make each fade-in much slower
const DELAY = 1000; // Increased delay to make the words appear more spaced out
const text = ['Welcome', 'to', 'CloseToYou'];

interface LoadingAnimationProps {
    onFinished: () => void;
}

const LoadingAnimation: React.FC<LoadingAnimationProps> = ({onFinished}) => {
    const opacity1 = useSharedValue(0);
    const opacity2 = useSharedValue(0);
    const opacity3 = useSharedValue(0);

    useEffect(() => {
        // Modify the delay to control when each element fades in
        opacity1.value = withDelay(0 * DELAY, withTiming(1, {duration: DURATION}));
        opacity2.value = withDelay(1 * DELAY, withTiming(1, {duration: DURATION}));
        opacity3.value = withDelay(
            2 * DELAY,
            withTiming(1, {duration: DURATION}, () => {
                runOnJS(onFinished)();
            }),
        );
    }, [onFinished, opacity1, opacity2, opacity3]);

    const animatedStyle1 = useAnimatedStyle(() => ({opacity: opacity1.value}));
    const animatedStyle2 = useAnimatedStyle(() => ({opacity: opacity2.value}));
    const animatedStyle3 = useAnimatedStyle(() => ({opacity: opacity3.value}));

    return (
        <View style={styles.container}>
            <Animated.Text style={[styles.text, animatedStyle1]}>{text[0]}</Animated.Text>
            <Animated.Text style={[styles.text, animatedStyle2]}>{text[1]}</Animated.Text>
            <Animated.Text style={[styles.text, animatedStyle3]}>{text[2]}</Animated.Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center', // Centers vertically
        alignItems: 'center', // Centers horizontally
    },
    text: {
        fontSize: 42,
        fontWeight: 'bold',
        marginHorizontal: 8,
    },
});

export default LoadingAnimation;
