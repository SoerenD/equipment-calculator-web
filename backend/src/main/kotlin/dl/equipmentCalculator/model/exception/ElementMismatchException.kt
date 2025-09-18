package dl.equipmentCalculator.model.exception

import dl.equipmentCalculator.model.ExceptionType.Companion.ELEMENT_MISMATCH

class ElementMismatchException(message: String = ELEMENT_MISMATCH) : RuntimeException(message)
