import { describe, it, expect } from 'vitest'
import Title from './title'
import ArgumentException from '../../../shared/errors/argumentException'

describe('Title', () => {
  describe('constructor', () => {
    it('creates an instance with a valid string', () => {
      const validValue = 'Bug Report'
      const title = new Title(validValue)
      expect(title.value).toBe(validValue)
    })

    it('throws an error if the string is empty', () => {
      const emptyValue = ''
      expect(() => new Title(emptyValue)).toThrow(ArgumentException)
    })
  })

  describe('equals', () => {
    it('returns true if both Title instances have the same value', () => {
      const value = 'Bug Report'
      const title1 = new Title(value)
      const title2 = new Title(value)
      const result = title1.equals(title2)
      expect(result).toBe(true)
    })

    it('returns false if Title instances have different values', () => {
      const title1 = new Title('Bug Report')
      const title2 = new Title('Feature Request')
      const result = title1.equals(title2)
      expect(result).toBe(false)
    })
  })
})
