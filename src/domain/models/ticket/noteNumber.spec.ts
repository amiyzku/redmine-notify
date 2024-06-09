import { describe, it, expect } from 'vitest'
import NoteNumber from './noteNumber'
import ArgumentException from '../../../shared/errors/argumentException'

describe('NoteNumber', () => {
  describe('constructor', () => {
    it('creates an instance with a valid number', () => {
      // Arrange
      const validNumber = 1

      // Act
      const noteNumber = new NoteNumber(validNumber)

      // Assert
      expect(noteNumber.value).toBe(validNumber)
    })

    it('throws an error if the number is zero', () => {
      // Arrange
      const invalidNumber = 0

      // Act & Assert
      expect(() => new NoteNumber(invalidNumber)).toThrow(ArgumentException)
    })
  })

  describe('equals', () => {
    it('returns true if both NoteNumbers have the same value', () => {
      // Arrange
      const number = 1
      const noteNumber1 = new NoteNumber(number)
      const noteNumber2 = new NoteNumber(number)

      // Act
      const result = noteNumber1.equals(noteNumber2)

      // Assert
      expect(result).toBe(true)
    })

    it('returns false if NoteNumbers have different values', () => {
      // Arrange
      const number1 = 1
      const number2 = 2
      const noteNumber1 = new NoteNumber(number1)
      const noteNumber2 = new NoteNumber(number2)

      // Act
      const result = noteNumber1.equals(noteNumber2)

      // Assert
      expect(result).toBe(false)
    })
  })
})
