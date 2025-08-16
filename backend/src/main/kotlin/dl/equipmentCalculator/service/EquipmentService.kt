package dl.equipmentCalculator.service

import com.fasterxml.jackson.core.type.TypeReference
import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import dl.equipmentCalculator.model.Element
import dl.equipmentCalculator.model.Equipment
import dl.equipmentCalculator.model.ItemJson
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Value
import org.springframework.core.ParameterizedTypeReference
import org.springframework.core.io.ClassPathResource
import org.springframework.http.HttpMethod
import org.springframework.stereotype.Service
import org.springframework.web.client.RestTemplate
import java.util.concurrent.ConcurrentHashMap
import javax.annotation.PostConstruct

@Service
class EquipmentService {
    
    @Value("\${server.port:8080}")
    private var serverPort: Int = 8080
    
    @Value("\${equipment.json.url:http://localhost}")
    private var baseUrl: String = "http://localhost"
    
    private val restTemplate = RestTemplate()
    private val objectMapper = jacksonObjectMapper()
    private val equipmentCache = ConcurrentHashMap<String, List<Equipment>>()
    
    companion object {
        private val LOG: Logger = LoggerFactory.getLogger(EquipmentService::class.java)
    }
    
    @PostConstruct
    fun loadEquipmentData() {
        val itemJsonList = try {
            loadFromHttpEndpoint()
        } catch (e: Exception) {
            LOG.warn("Failed to load equipment data from HTTP endpoint: ${e.message}")
            LOG.info("Falling back to local JSON file...")
            try {
                loadFromLocalFile()
            } catch (fallbackException: Exception) {
                LOG.error("Failed to load equipment data from fallback file: ${fallbackException.message}", fallbackException)
                initializeEmptyCache()
                return
            }
        }
        
        processEquipmentData(itemJsonList)
    }
    
    private fun loadFromHttpEndpoint(): List<ItemJson> {
        val url = if (baseUrl.startsWith("https://")) {
            "$baseUrl/item/items_json"
        } else {
            "$baseUrl:$serverPort/item/items_json"
        }
        LOG.info("Attempting to load equipment data from: $url")
        
        val response = restTemplate.exchange(
            url,
            HttpMethod.GET,
            null,
            object : ParameterizedTypeReference<List<ItemJson>>() {}
        )
        
        val itemJsonList = response.body ?: throw RuntimeException("Empty response from HTTP endpoint")
        LOG.info("Successfully loaded ${itemJsonList.size} items from HTTP endpoint")
        return itemJsonList
    }
    
    private fun loadFromLocalFile(): List<ItemJson> {
        LOG.info("Loading equipment data from local file: resources/items.json")
        val resource = ClassPathResource("items.json")
        
        if (!resource.exists()) {
            throw RuntimeException("Local fallback file items.json not found in resources")
        }
        
        val itemJsonList = objectMapper.readValue(
            resource.inputStream,
            object : TypeReference<List<ItemJson>>() {}
        )
        
        LOG.info("Successfully loaded ${itemJsonList.size} items from local file")
        return itemJsonList
    }
    
    private fun processEquipmentData(itemJsonList: List<ItemJson>) {
        val equipmentByType = itemJsonList
            .filter { it.langItem != null }
            .groupBy { it.typ }
            .mapValues { (_, items) -> 
                items.map { mapJsonToEquipment(it) }
            }
        
        // Cache the equipment lists
        equipmentCache["Helm"] = equipmentByType["Helm"] ?: emptyList()
        equipmentCache["Ruestung"] = equipmentByType["Ruestung"] ?: emptyList()
        equipmentCache["Schild"] = equipmentByType["Schild"] ?: emptyList()
        equipmentCache["Ring"] = equipmentByType["Ring"] ?: emptyList()
        equipmentCache["Waffe"] = equipmentByType["Waffe"] ?: emptyList()
        
        LOG.info("Equipment data processed successfully:")
        LOG.info("Helmets: ${equipmentCache["Helm"]?.size ?: 0}")
        LOG.info("Armor: ${equipmentCache["Ruestung"]?.size ?: 0}")
        LOG.info("Shields: ${equipmentCache["Schild"]?.size ?: 0}")
        LOG.info("Accessories: ${equipmentCache["Ring"]?.size ?: 0}")
        LOG.info("Weapons: ${equipmentCache["Waffe"]?.size ?: 0}")
    }
    
    private fun initializeEmptyCache() {
        LOG.error("Initializing empty equipment cache due to loading failures")
        equipmentCache["Helm"] = emptyList()
        equipmentCache["Ruestung"] = emptyList()
        equipmentCache["Schild"] = emptyList()
        equipmentCache["Ring"] = emptyList()
        equipmentCache["Waffe"] = emptyList()
    }
    
    private fun mapJsonToEquipment(itemJson: ItemJson): Equipment {
        return Equipment(
            ap = itemJson.ap,
            vp = itemJson.vp,
            hp = itemJson.hp,
            mp = itemJson.mp,
            weight = itemJson.kraft,
            ranged = itemJson.distanz > 0,
            element = mapIntToElement(itemJson.element),
            requiredWaffenschmiede = itemJson.blacksmithLevel,
            name = itemJson.langItem ?: "Unknown Item"
        )
    }
    
    private fun mapIntToElement(elementInt: Int): Element {
        return when (elementInt) {
            0 -> Element.NONE
            1, 256, 257 -> Element.FIRE
            2, 512, 514 -> Element.ICE
            4, 1024, 1028 -> Element.AIR
            8, 2048, 2056 -> Element.EARTH
            else -> {
                // Handle combinations or unknown values
                var hasfire = false
                var hasIce = false
                var hasAir = false
                var hasEarth = false
                
                if (elementInt and 1 != 0 || elementInt and 256 != 0) hasfire = true
                if (elementInt and 2 != 0 || elementInt and 512 != 0) hasIce = true
                if (elementInt and 4 != 0 || elementInt and 1024 != 0) hasAir = true
                if (elementInt and 8 != 0 || elementInt and 2048 != 0) hasEarth = true
                
                when {
                    hasfire && hasAir -> Element.FIRE_AIR
                    hasEarth && hasIce -> Element.EARTH_ICE
                    hasfire -> Element.FIRE
                    hasIce -> Element.ICE
                    hasAir -> Element.AIR
                    hasEarth -> Element.EARTH
                    else -> Element.NONE
                }
            }
        }
    }
    
    fun getAllHelmets(): List<Equipment> {
        return addDefaultNoneItem(equipmentCache["Helm"] ?: emptyList())
    }
    
    fun getAllArmour(): List<Equipment> {
        return addDefaultNoneItem(equipmentCache["Ruestung"] ?: emptyList())
    }
    
    fun getAllShields(): List<Equipment> {
        return addDefaultNoneItem(equipmentCache["Schild"] ?: emptyList())
    }
    
    fun getAllAccessories(): List<Equipment> {
        return addDefaultNoneItem(equipmentCache["Ring"] ?: emptyList())
    }
    
    fun getAllWeapons(): List<Equipment> {
        return addDefaultNoneItem(equipmentCache["Waffe"] ?: emptyList())
    }
    
    private fun addDefaultNoneItem(items: List<Equipment>): List<Equipment> {
        val defaultItem = Equipment(
            ap = 0, vp = 0, hp = 0, mp = 0, weight = 0, 
            ranged = false, element = Element.NONE, 
            requiredWaffenschmiede = 0, name = "besser nix"
        )
        return listOf(defaultItem) + items
    }
    
    fun refreshEquipmentData() {
        LOG.info("Refreshing equipment data...")
        loadEquipmentData()
    }
    
    fun getDataSource(): String {
        return try {
            loadFromHttpEndpoint()
            "HTTP Endpoint"
        } catch (e: Exception) {
            "Local File (Fallback)"
        }
    }
}
