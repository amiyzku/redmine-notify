import { describe, it, expect } from 'vitest'
import URI from './uri'
import ArgumentException from '../../../shared/errors/argumentException'

describe('Ref', () => {
  describe('constructor', () => {
    it('creates an instance with a valid URI', () => {
      // Arrange
      const validValue = 'https://example.com/'

      // Act
      const uri = new URI(validValue)

      // Assert
      expect(uri.value).toBe(validValue)
    })

    it('throws an error if the value is invalid URI', () => {
      // Arrange
      const invalidValue = ''

      // Act & Assert
      expect(() => new URI(invalidValue)).toThrow(ArgumentException)
    })
  })

  describe('equals', () => {
    it('returns true if both URI instances have the same value', () => {
      // Arrange
      const value = 'https://example.com'
      const uri1 = new URI(value)
      const uri2 = new URI(value)

      // Act
      const result = uri1.equals(uri2)

      // Assert
      expect(result).toBe(true)
    })

    it('returns true if only the fragment differs', () => {
      // Arrange
      const uri1 = new URI('https://example.com#foo')
      const uri2 = new URI('https://example.com#bar')

      // Act
      const result = uri1.equals(uri2)

      // Assert
      expect(result).toBe(true)
    })

    it('returns false if URI instances have different values', () => {
      // Arrange
      const uri1 = new URI('https://example.com')
      const uri2 = new URI('https://example2.com')

      // Act
      const result = uri1.equals(uri2)

      // Assert
      expect(result).toBe(false)
    })
  })
})
