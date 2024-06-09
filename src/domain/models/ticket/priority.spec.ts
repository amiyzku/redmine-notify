import { describe, it, expect } from 'vitest'
import Priority from './priority'
import ArgumentException from '../../../shared/errors/argumentException'

describe('Priority', () => {
  describe('constructor', () => {
    it('creates an instance with a valid string', () => {
      // Arrange
      const validValue = 'High'

      // Act
      const priority = new Priority(validValue)

      // Assert
      expect(priority.value).toBe(validValue)
    })

    it('throws an error if the value is not a string', () => {
      // Arrange
      const invalidValue = 12345 // Invalid type

      // Act & Assert
      expect(() => new Priority(invalidValue as unknown as string)).toThrow(ArgumentException)
    })

    it('throws an error if the string is empty', () => {
      // Arrange
      const emptyValue = ''

      // Act & Assert
      expect(() => new Priority(emptyValue)).toThrow(ArgumentException)
    })
  })

  describe('equals', () => {
    it('returns true if both Priority instances have the same value', () => {
      // Arrange
      const value = 'High'
      const priority1 = new Priority(value)
      const priority2 = new Priority(value)

      // Act
      const result = priority1.equals(priority2)

      // Assert
      expect(result).toBe(true)
    })

    it('returns false if Priority instances have different values', () => {
      // Arrange
      const priority1 = new Priority('High')
      const priority2 = new Priority('Low')

      // Act
      const result = priority1.equals(priority2)

      // Assert
      expect(result).toBe(false)
    })
  })
})
