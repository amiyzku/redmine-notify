import { describe, it, expect } from 'vitest'
import Status from './status'
import ArgumentException from '../../../shared/errors/argumentException'

describe('Status', () => {
  describe('constructor', () => {
    it('creates an instance with a valid string', () => {
      const validValue = 'Open'
      const status = new Status(validValue)
      expect(status.value).toBe(validValue)
    })

    it('throws an error if the string is empty', () => {
      const emptyValue = ''
      expect(() => new Status(emptyValue)).toThrow(ArgumentException)
    })
  })

  describe('equals', () => {
    it('returns true if both Status instances have the same value', () => {
      const value = 'Open'
      const status1 = new Status(value)
      const status2 = new Status(value)
      const result = status1.equals(status2)
      expect(result).toBe(true)
    })

    it('returns false if Status instances have different values', () => {
      const status1 = new Status('Open')
      const status2 = new Status('Closed')
      const result = status1.equals(status2)
      expect(result).toBe(false)
    })
  })
})
