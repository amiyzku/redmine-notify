import { describe, it, expect } from 'vitest'
import PoolingIntervalSec from './poolingIntervalSec'
import ArgumentException from '../../../shared/errors/argumentException'

describe('PoolingIntervalSec', () => {
  describe('constructor', () => {
    it('creates an instance with a valid number greater than or equal to 30', () => {
      // Arrange
      const validValue = 30

      // Act
      const interval = new PoolingIntervalSec(validValue)

      // Assert
      expect(interval.second).toBe(validValue)
    })

    it('throws an error if the value is less than 30', () => {
      // Arrange
      const invalidValue = 29

      // Act & Assert
      expect(() => new PoolingIntervalSec(invalidValue)).toThrow(ArgumentException)
    })
  })

  describe('equals', () => {
    it('returns true if both PoolingIntervalSec have the same value', () => {
      // Arrange
      const value = 60
      const interval1 = new PoolingIntervalSec(value)
      const interval2 = new PoolingIntervalSec(value)

      // Act
      const result = interval1.equals(interval2)

      // Assert
      expect(result).toBe(true)
    })

    it('returns false if PoolingIntervalSec have different values', () => {
      // Arrange
      const interval1 = new PoolingIntervalSec(60)
      const interval2 = new PoolingIntervalSec(90)

      // Act
      const result = interval1.equals(interval2)

      // Assert
      expect(result).toBe(false)
    })
  })
})
