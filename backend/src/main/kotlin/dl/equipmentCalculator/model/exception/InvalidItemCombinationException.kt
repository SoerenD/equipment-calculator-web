package dl.equipmentCalculator.model.exception

import dl.equipmentCalculator.model.ExceptionType.Companion.INVALID_ITEM_COMBINATION

class InvalidItemCombinationException(message: String = INVALID_ITEM_COMBINATION) : RuntimeException(message)
