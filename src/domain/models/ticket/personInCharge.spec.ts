import { describe, it, expect } from 'vitest'
import PersonInCharge from './personInCharge'
import ArgumentException from '../../../shared/errors/argumentException'

describe('PersonInCharge', () => {
  describe('constructor', () => {
    it('creates an instance with a valid string', () => {
      // Arrange
      const validName = 'John Doe'

      // Act
      const personInCharge = new PersonInCharge(validName)

      // Assert
      expect(personInCharge.value).toBe(validName)
    })

    it('throws an error if the value is not a string', () => {
      // Arrange
      const invalidName = 12345 // Invalid type

      // Act & Assert
      expect(() => new PersonInCharge(invalidName as unknown as string)).toThrow(ArgumentException)
    })

    it('throws an error if the string is empty', () => {
      // Arrange
      const emptyName = ''

      // Act & Assert
      expect(() => new PersonInCharge(emptyName)).toThrow(ArgumentException)
    })
  })

  describe('equals', () => {
    it('returns true if both PersonInCharge have the same value', () => {
      // Arrange
      const name = 'John Doe'
      const personInCharge1 = new PersonInCharge(name)
      const personInCharge2 = new PersonInCharge(name)

      // Act
      const result = personInCharge1.equals(personInCharge2)

      // Assert
      expect(result).toBe(true)
    })

    it('returns false if PersonInCharge have different values', () => {
      // Arrange
      const personInCharge1 = new PersonInCharge('John Doe')
      const personInCharge2 = new PersonInCharge('Jane Doe')

      // Act
      const result = personInCharge1.equals(personInCharge2)

      // Assert
      expect(result).toBe(false)
    })
  })
})
