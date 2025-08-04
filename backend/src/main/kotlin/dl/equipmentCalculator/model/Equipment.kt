package dl.equipmentCalculator.model

import dl.equipmentCalculator.model.Element.Companion.isValidElementCombination
import dl.equipmentCalculator.service.EquipmentService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Component

data class Equipment(
        val ap: Int,
        val vp: Int,
        val hp: Int,
        val mp: Int,
        val weight: Int,
        val ranged: Boolean,
        val element: Element,
        val requiredWaffenschmiede: Int,
        val name: String) {

    companion object {
        val MAX_WEIGHT_BONUS = 57;

        fun validWeightAndElements(
                unitElement: Element,
                maxWeight: Int,
                vararg equipment: Equipment
        ): Boolean {
            val equipmentElements = equipment.map { it.element };
            val totalWeight = equipment.map { it.weight }.reduce { acc, curr -> acc + curr }
            return isValidElementCombination(unitElement, *equipmentElements.toTypedArray()) && totalWeight <= maxWeight;
        }
    }
}

@Component
class EquipmentLists {
    
    @Autowired
    private lateinit var equipmentService: EquipmentService
    
    fun getAllHelmets(): List<Equipment> = equipmentService.getAllHelmets()
    fun getAllArmour(): List<Equipment> = equipmentService.getAllArmour()
    fun getAllShields(): List<Equipment> = equipmentService.getAllShields()
    fun getAllAccessories(): List<Equipment> = equipmentService.getAllAccessories()
    fun getAllWeapons(): List<Equipment> = equipmentService.getAllWeapons()
}
