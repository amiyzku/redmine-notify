import { describe, it, expect } from 'vitest'
import NotificationStatus from './notificationStatus'

describe('NotificationStatus', () => {
  describe('constructor', () => {
    it('creates an instance with valid values', () => {
      // Arrange
      const validValues: Array<'enable' | 'disable'> = ['enable', 'disable']

      // Act & Assert
      validValues.forEach((value) => {
        const notificationStatus = new NotificationStatus(value)
        expect(notificationStatus.value).toBe(value)
      })
    })
  })

  describe('equals', () => {
    it('returns true if both NotificationStatus have the same value', () => {
      // Arrange
      const value = 'enable'
      const notificationStatus1 = new NotificationStatus(value)
      const notificationStatus2 = new NotificationStatus(value)

      // Act
      const result = notificationStatus1.equals(notificationStatus2)

      // Assert
      expect(result).toBe(true)
    })

    it('returns false if NotificationStatus have different values', () => {
      // Arrange
      const notificationStatus1 = new NotificationStatus('enable')
      const notificationStatus2 = new NotificationStatus('disable')

      // Act
      const result = notificationStatus1.equals(notificationStatus2)

      // Assert
      expect(result).toBe(false)
    })
  })
})
