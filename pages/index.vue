<script setup lang="ts">
import axios from 'axios';
import { Idata, baseURL } from '../composables/functions';
import { hexToRgb, RGBtoXYZ, XYZtoLAB } from '../composables/colorConvertion';

useHead({ title: "Coverup" });

const selectedColour = ref("#815A50");   //colour to search for
const selectedPreset = ref("#815A50");  //colour preset
const selectedClass = ref(8);   //selected class for search
const selectedType = ref(1);    //selected item type for search
let slots = ref([-1, -1, -1]);  //selected items for loadout
type Item = {
    id: number;
    distance: number;
}

const sortedArray1 = ref<Item[]>();
const sortedArray2 = ref<Item[]>();

let data = await axios.get<Idata[]>(baseURL + "8/1.json");

onMounted(async ()=>{
    presetChange();
});

function loadItems() {
    if (!sortedArray2.value) {
        sortedArray2.value = [];
    }

    let n = sortedArray2.value?.length;

    for (let i = n; i < n + 50; i++) {
        // @ts-ignore: Object is possibly 'null'.
        if (!sortedArray1.value[i]) {
            return;
        }

        // @ts-ignore: Object is possibly 'null'.
        sortedArray2.value.push(sortedArray1.value[i])
    }
}

function onScroll(e: Event) {
  const { scrollTop, offsetHeight, scrollHeight } = e.target  as HTMLInputElement;
  if ((scrollTop + offsetHeight) >= scrollHeight) {
    loadItems();
  }
}

function search() {
    const inputColor  = hexToRgb(selectedColour.value)
    if (!inputColor) return;

    let xyz1 = RGBtoXYZ([inputColor.r, inputColor.g, inputColor.b]);
    let lab1 = XYZtoLAB([xyz1[0], xyz1[1], xyz1[2]]);

    let deltaE1976 = 0;
    sortedArray1.value = [];
    sortedArray2.value = [];
    for (let i = 0; i < data.data.length; i++) {

        const xyz2 = RGBtoXYZ([data.data[i].color[0], data.data[i].color[1], data.data[i].color[2]]);
        const lab2 = XYZtoLAB([xyz2[0], xyz2[1], xyz2[2]]);

        deltaE1976 = Math.sqrt(
            Math.pow(lab1[0] - lab2[0], 2) +
            Math.pow(lab1[1] - lab2[1], 2) +
            Math.pow(lab1[2] - lab2[2], 2));
        sortedArray1.value.push({id: data.data[i].id, distance: deltaE1976});
    }
    sortedArray1.value.sort((a, b) => (a.distance > b.distance) ? 1 : -1);
    loadItems();
}

function presetChange() {
    selectedColour.value = selectedPreset.value;
    search();
}

function checkCompatability(id: number): boolean {

    // let regionArray = data.data[id].region.split(",");
    // for(let i = 0; i < regionArray.length; i++) {
    //     for (let j = 0; j < 3; j++) {
    //         if (slots.value[i] != -1) {
    //             if (data.data[slots.value[j]].region.includes(regionArray[i])) return false;
    //         }
    //     }
    // }

    for (let i = 0; i < 3; i++) {
        if (slots.value[i] === id) {
            return false;
        }
        if (slots.value[i] != -1) {
            //check regions are not the same
            if (data.data[slots.value[i]].region === data.data[id].region) return false;
            
            //check regions don't overlap
            if (data.data[slots.value[i]].region.includes("Glasses")) {
                if (data.data[id].region.includes("Face") || data.data[id].region.includes("Lenses")) return false;
            } else if (data.data[slots.value[i]].region.includes("Whole Head")) {
                if (data.data[id].region.includes("Hat") || data.data[id].region.includes("Face") || data.data[id].region.includes("Glasses")) return false;
            }

            if (data.data[id].region.includes("Glasses")) {
                if (data.data[slots.value[i]].region.includes("Face") || data.data[slots.value[i]].region.includes("Lenses")) return false;
            } else if (data.data[id].region.includes("Whole Head")) {
                if (data.data[slots.value[i]].region.includes("Hat") || data.data[slots.value[i]].region.includes("Face") || data.data[slots.value[i]].region.includes("Glasses")) return false;
            }
        }
    }

    if (slots.value[0] != -1 && slots.value[1] != -1 && slots.value[2] != -1) {
        return false;
    }

    return true;
}

function equipCosmetic(id: number) {
//     try {
//         const image = e.target.querySelector('img');
//         if (image) {
//             image.classList.add("flying-img");
//             setTimeout(() => {
//                 image.classList.remove("flying-img");
//             }, 1000);
//         } else {
//             e.target.classList.add("flying-img");
//             setTimeout(() => {
//                 e.target.classList.remove("flying-img");
//             }, 1000);
//         }
//     } catch {
//         console.log("Animation error");
//     }

    //check that cosmetic is not already equipped
    for (let i = 0; i < 3; i++) {
        if (slots.value[i] === id) {
            slots.value[i] = -1;
            return;
        }
        if (slots.value[i] != -1) {
            //check regions are not the same
            if (data.data[slots.value[i]].region === data.data[id].region) return;
            
            //check regions don't overlap
            if (data.data[slots.value[i]].region === "Glasses") {
                if (data.data[id].region === "Face" || data.data[id].region === "Lenses") return;
            } else if (data.data[slots.value[i]].region === "Whole Head") {
                if (data.data[id].region === "Hat" || data.data[id].region === "Face" || data.data[id].region === "Glasses") return;
            }

            if (data.data[id].region === "Glasses") {
                if (data.data[slots.value[i]].region === "Face" || data.data[slots.value[i]].region === "Lenses") return;
            } else if (data.data[id].region === "Whole Head") {
                if (data.data[slots.value[i]].region === "Hat" || data.data[slots.value[i]].region === "Face" || data.data[slots.value[i]].region === "Glasses") return;
            }
        }
    }

    if (slots.value[0] === -1) {
        slots.value[0] = id;
    } else if (slots.value[1] === -1) {
        slots.value[1] = id;
    } else {
        slots.value[2] = id;
    }
}

async function itemSwitch() {
    slots.value[0] = slots.value[1] = slots.value[2] = -1;
    let url = baseURL + selectedClass.value + "/" + selectedType.value + ".json";
    if (selectedType.value === 3) {
        url = baseURL + selectedType.value + ".json";
    }
    
    data = await axios.get<Idata[]>(url);
    search();
}
</script>
<template>
    <div class="h-screen flex flex-col">
        <div class="h-[45vh] w-full flex flex-row">
            <div class="h-full w-[50vw] p-2">
                <div class="w-full h-full border-2 border-[#84756B] rounded-xl bg-[#2A2725] flex flex-col justify-evenly">
                    <div class="mx-auto w-[70%] h-[30%] border-2 border-[#84756B] rounded-xl bg-[#292526] text-center">
                        <p class="text-[#766B5E]">Cosmetic 1</p>
                        <div v-if="slots[0] > -1" @click="slots[0] = -1">
                            <img :src=data.data[slots[0]].src class="mx-auto hover:scale-110 h-[56px]">
                            <a :href=data.data[slots[0]].href target="_blank" class="mx-auto mt-auto underline hover:text-blue-100"><p>{{ data.data[slots[0]].title }}</p></a>
                            <p class="text-xs text-yellow-400">Equip region: {{ data.data[slots[0]].region }}</p>
                        </div>
                    </div>
                    <div class="mx-auto w-[70%] h-[30%] border-2 border-[#84756B] rounded-xl bg-[#292526] text-center">
                        <p class="text-[#766B5E]">Cosmetic 2</p>
                        <div v-if="slots[1] > -1" @click="slots[1] = -1">
                            <img :src=data.data[slots[1]].src class="mx-auto hover:scale-110 h-[56px]">
                            <a :href=data.data[slots[1]].href target="_blank" class="mx-auto mt-auto underline hover:text-blue-100"><p>{{ data.data[slots[1]].title }}</p></a>
                            <p class="text-xs text-yellow-400">Equip region: {{ data.data[slots[1]].region }}</p>
                        </div>
                    </div>
                    <div class="mx-auto w-[70%] h-[30%] border-2 border-[#84756B] rounded-xl bg-[#292526] text-center">
                        <p class="text-[#766B5E]">Cosmetic 3</p>
                        <div v-if="slots[2] > -1" @click="slots[2] = -1">
                            <img :src=data.data[slots[2]].src class="mx-auto hover:scale-110 h-[56px]">
                            <a :href=data.data[slots[2]].href target="_blank" class="mx-auto mt-auto underline hover:text-blue-100"><p>{{ data.data[slots[2]].title }}</p></a>
                            <p class="text-xs text-yellow-400">Equip region: {{ data.data[slots[2]].region }}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="h-full w-[50vw] p-2">
                <div class="overflow-hidden w-full h-full border-2 border-[#84756B] rounded-xl bg-[#2A2725] p-2">
                    <div class="h-12 flex justify-around overflow-hidden">
                        <div :class="{'bg-[#181614]': selectedClass === 1, 'bg-[#393631]': selectedClass != 1}" class="h-[20px] md:h-[40px] w-[20px] md:w-[40px] my-auto rounded-xl">
                            <img src="/class_icons/1.png" class="h-full hover:scale-110 m-auto" title="Scout" @click="selectedClass = 1; itemSwitch();">
                        </div>
                        <div :class="{'bg-[#181614]': selectedClass === 2, 'bg-[#393631]': selectedClass != 2}" class="h-[20px] md:h-[40px] w-[20px] md:w-[40px] my-auto rounded-xl">
                            <img src="/class_icons/2.png" class="h-full hover:scale-110 m-auto" title="Soldier" @click="selectedClass = 2; itemSwitch();">
                        </div>
                        <div :class="{'bg-[#181614]': selectedClass === 3, 'bg-[#393631]': selectedClass != 3}" class="h-[20px] md:h-[40px] w-[20px] md:w-[40px] my-auto rounded-xl">
                            <img src="/class_icons/3.png" class="h-full hover:scale-110 m-auto" title="Pyro" @click="selectedClass = 3; itemSwitch();">
                        </div>
                        <div :class="{'bg-[#181614]': selectedClass === 4, 'bg-[#393631]': selectedClass != 4}" class="h-[20px] md:h-[40px] w-[20px] md:w-[40px] my-auto rounded-xl">
                            <img src="/class_icons/4.png" class="h-full hover:scale-110 m-auto" title="Demoman" @click="selectedClass = 4; itemSwitch();">
                        </div>
                        <div :class="{'bg-[#181614]': selectedClass === 5, 'bg-[#393631]': selectedClass != 5}" class="h-[20px] md:h-[40px] w-[20px] md:w-[40px] my-auto rounded-xl">
                            <img src="/class_icons/5.png" class="h-full hover:scale-110 m-auto" title="Heavy" @click="selectedClass = 5; itemSwitch();">
                        </div>
                        <div :class="{'bg-[#181614]': selectedClass === 6, 'bg-[#393631]': selectedClass != 6}" class="h-[20px] md:h-[40px] w-[20px] md:w-[40px] my-auto rounded-xl">
                            <img src="/class_icons/6.png" class="h-full hover:scale-110 m-auto" title="Engineer" @click="selectedClass = 6; itemSwitch();">
                        </div>
                        <div :class="{'bg-[#181614]': selectedClass === 7, 'bg-[#393631]': selectedClass != 7}" class="h-[20px] md:h-[40px] w-[20px] md:w-[40px] my-auto rounded-xl">
                            <img src="/class_icons/7.png" class="h-full hover:scale-110 m-auto" title="Medic" @click="selectedClass = 7; itemSwitch();">
                        </div>
                        <div :class="{'bg-[#181614]': selectedClass === 8, 'bg-[#393631]': selectedClass != 8}" class="h-[20px] md:h-[40px] w-[20px] md:w-[40px] my-auto rounded-xl">
                            <img src="/class_icons/8.png" class="h-full hover:scale-110 m-auto" title="Sniper" @click="selectedClass = 8; itemSwitch();">
                        </div>
                        <div :class="{'bg-[#181614]': selectedClass === 9, 'bg-[#393631]': selectedClass != 9}" class="h-[20px] md:h-[40px] w-[20px] md:w-[40px] my-auto rounded-xl">
                            <img src="/class_icons/9.png" class="h-full hover:scale-110 m-auto" title="Spy" @click="selectedClass = 9; itemSwitch();">
                        </div>
                    </div>
                    <label for="color" class="mt-2 block text-sm font-medium">Color HEX value: <a class="colored">{{ selectedColour }}</a></label>
                    <input type="color" id="color" v-model="selectedColour" class="h-8 bg-transparent w-full cursor-pointer" @change="search()"/>
                    <label for="preset" class="mt-2 block text-sm font-medium">Preset:</label>
                    <select v-model="selectedPreset" id="preset" class="h-8 cursor-pointer w-full rounded-lg bg-[#DD644F] outline-none" @change="presetChange()">
                        <option value="#D34847">RED</option>
                        <option value="#6E9CD0">BLU</option>
                        <option value="#AE9779">pl_upward</option>
                        <option value="#EE8B58">pl_badwater</option>
                        <option value="#815A50">ctf_2fort</option>
                        <option value="#785D51">plr_hightower</option>
                    </select>
                    <button @click="$router.push('/about')" class="overflow-hidden h-8 mt-4 w-full bg-[#DD644F] text-[#ECE3CB] p-1 px-2 rounded-lg active:bg-[#ECE3CB] active:text-[#DD644F]">About</button>
                    <div class="h-12 flex justify-around overflow-hidden mt-4">
                        <div :class="{'bg-[#181614]': selectedType === 1, 'bg-[#393631]': selectedType != 1}" class="h-[40px] w-[90px] md:w-[110px] xl:w-[170px] my-auto rounded-xl text-center p-2">
                            <p class="h-full hover:scale-110" @click="selectedType = 1; itemSwitch();">Classy</p>
                        </div>
                        <div :class="{'bg-[#181614]': selectedType === 2, 'bg-[#393631]': selectedType != 2}" class="h-[40px] w-[90px] md:w-[110px] xl:w-[170px] my-auto rounded-xl text-center p-2">
                            <p class="h-full hover:scale-110" @click="selectedType = 2; itemSwitch();">Painted</p>
                        </div>
                        <div :class="{'bg-[#181614]': selectedType === 3, 'bg-[#393631]': selectedType != 3}" class="h-[40px] w-[90px] md:w-[110px] xl:w-[170px] my-auto rounded-xl text-center p-2">
                            <p class="h-full hover:scale-110" @click="selectedType = 3; itemSwitch();">Paints</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="h-[55vh] w-full">
            <div class="h-full w-full p-2">
                <div class="scrollbar overflow-auto w-full h-full border-2 border-[#84756B] rounded-xl bg-[#2A2725]" @scroll="onScroll">
                    <div class="w-full h-full grid grid-cols-2 gap-4 content-start p-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7">
                        <div class="overflow-hidden w-[220px] h-[120px] bgcolored border-2 border-[#84756B] rounded-lg flex flex-col text-center truncate p-2" v-for="(item, i) in sortedArray2" :class="{'text-[#272621]': checkCompatability(item.id) === false}">
                            <a :href=data.data[item.id].href target="_blank" class="mx-auto mt-auto underline hover:text-blue-100"><p>{{ data.data[item.id].title }}</p></a>
                            <p :class="{'text-green-500': item.distance >= 0,
                                        'text-green-400': item.distance >= 1,
                                        'text-lime-300': item.distance >= 2,
                                        'text-yellow-500': item.distance >= 3,
                                        'text-orange-500': item.distance >= 4,
                                        'text-red-500': item.distance >= 5}" title="Delta E 1976">{{ Math.round(item.distance * 1000) / 1000 }}</p>
                            <img :src=data.data[item.id].src class="mx-auto mt-auto hover:scale-110 h-[56px]" :title='"Equip region: " + data.data[item.id].region' @click="equipCosmetic(item.id)">
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<style>
.colored {
    color: v-bind(selectedColour);
}

.bgcolored {
    background-color: v-bind(selectedColour);
}

.flying-img {
    position: absolute;
    animation: fly_to_slot 1s ease-in-out infinite;
}

.scrollbar::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.scrollbar::-webkit-scrollbar-track {
  box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
}
 
.scrollbar::-webkit-scrollbar-thumb {
  background-color: darkgrey;
  outline: 1px solid slategrey;
  border-radius: 4px;
}

.scrollbar::-webkit-scrollbar-corner {
    background: transparent;
}


@keyframes fly_to_slot {
    0% {
        left: 0;
        top: 0;
    }
    45%, 50% {
        left: var(--left);
        top: 60px;
    }
    80%, 90% {
        left: var(--left);
        top: var(--top);
        transform: scale(.4);
    }
    100% {
        left: calc(var(--left) +40px);
        top: var(--top);
        transform: scale(.4);
    }
}
</style>