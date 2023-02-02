# Coverup
## A website made for finding camouflage cosmetics in [Team Fortress 2](https://www.teamfortress.com/)

![image](https://user-images.githubusercontent.com/103208695/216374145-2d2cd82a-2594-4ac0-a3da-b277d69e0cc5.png)

## How to use
First of all, you will need to get colour to search for. You can do it in just about any image editing software, but from free options I recommend [paint.net](https://www.getpaint.net/download.html). Launch TF2 and take a screenshot of the area you want to camouflage, open it, click Image -> Resize and input width and height of 1 pixel, click ok, select colour picker tool and click on that pixel. On the colour tab you can click "More >>" and get RGB values. Now simply input it into the corresponding field on the website (or select preset), select class and item type to search for and you're done!

![Untitled](https://user-images.githubusercontent.com/103208695/216416301-4bbb05c3-6a02-4852-be6e-24260a71ba85.png)

## What those numbers mean
Those numbers above items are [Delta E 1976](https://en.wikipedia.org/wiki/Color_difference) values. It's a single number that represents the 'distance' between two colors:
|   |   |
|---|---|
| 0 | No color difference |
| 1 | Slight color difference |
| 2 | Small color difference |
| 3 | Medium color difference |
| 4 | Large color difference |
| 5+ | Very large color difference |

## What items are compatable with eachother
According to [TF2 wiki](https://wiki.teamfortress.com/wiki/Equip_region): "Equipping two items that have equip regions in both below columns, or two items that have the same region, is not allowed by the game."
| Equip region | Conflicts |
|---|---|
| Glasses | Face, Lenses |
| Whole Head | Hat, Face, Glasses |

**Note: if you've got items and they are not compatible with one another or their color is different to the one listed on the site, don't blame me, I took all information from the wiki and not game files!**

Class icons by [Sickday](https://steamcommunity.com/profiles/76561198028686534): https://github.com/Qixalite/tf2-classfont

## How to launch yourself using [Node.js](https://nodejs.org/en/) and [Visual Studio Code](https://code.visualstudio.com/download)

```bash
# install yarn
npm install --global yarn

# now install all modules
yarn

# now start project
yarn dev
```

## License
This program is licensed under the GPL-3.0 License. Please read the License file to know about the usage terms and conditions.
