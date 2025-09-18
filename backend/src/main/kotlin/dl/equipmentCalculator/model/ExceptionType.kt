package dl.equipmentCalculator.model

sealed class ExceptionType {
    companion object {
        const val INVALID_ITEM_COMBINATION = "Es konnte keine passende Ausrüstungs-Kombination gefunden werden. Versuchen Sie andere Einstellungen oder entfernen Sie Gegenstände aus der Ignorierliste."
        const val ELEMENT_MISMATCH = "Die gewählte Elementkombination ist ungültig."
    }
}
