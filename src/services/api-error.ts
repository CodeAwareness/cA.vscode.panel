export type TValidationError = Partial<{
  message: string
}>

export type TAPIError =
  & { errors: Record<string, TValidationError> }
  & { message: string, statusCode: number }

function apiError(err: TAPIError): string {
  console.log('API ERROR', err)
  if (err?.message) return err.message // API Service errors
  if (err?.errors) {
    // API Validation (Joi) errors
    return Object.keys(err.errors).map((key: string) => err.errors[key].message).join('\r')
  }
  return err.toString()
}

export default apiError
