package dl.equipmentCalculator.model

import com.fasterxml.jackson.annotation.JsonProperty

data class ItemJson(
    val id: Int,
    val name: String,
    val typ: String,
    val tier: Int,
    val ap: Int,
    val vp: Int,
    val hp: Int,
    val mp: Int,
    val tragkraft: Int,
    val erz: Int,
    val gold: Int,
    val holz: Int,
    val nahrung: Int,
    val silber: Int,
    val zeit: Int,
    val opferpunkte: Int,
    val kraft: Int,
    val distanz: Int,
    val element: Int,
    val itemmask: Int,
    @JsonProperty("einheit_var_requirements")
    val einheitVarRequirements: String,
    val specialrequirements: Int,
    val specialrequirements2: Int,
    val beschreibung: String,
    @JsonProperty("blacksmith_level")
    val blacksmithLevel: Int,
    @JsonProperty("lang_item")
    val langItem: String?
)
