import React from 'react';

const CircuitBuilderContext = React.createContext({})

export const CircuitBuilderProvider = CircuitBuilderContext.Provider
export const CircuitBuilderConsumer = CircuitBuilderContext.Consumer

export default CircuitBuilderContext