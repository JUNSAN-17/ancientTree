<template>
  <div class="tree-display">
    <!-- Title Section -->
    <div class="page-title">
      <h1>金陵树王风采展示</h1>
    </div>

    <!-- Card Section -->
    <div class="card-container">
      <el-row :gutter="15" class="card-row">
        <el-col v-for="(tree, index) in trees" :key="index" :span="6" class="card-col">
          <el-card class="tree-card" @click="openDetailDialog(tree)">
            <img :src="tree.images[0]" class="card-img" alt="Tree Image" />
            <div class="card-body">
              <h3 class="tree-name">{{ tree.name }}</h3>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <!-- Overlay for Tree Details -->
    <div v-if="selectedTree" class="overlay" @click="selectedTree = null">
      <el-card class="overlay-card" @click.stop>
        <el-carousel :interval="5000" arrow="always" type="card">
          <el-carousel-item v-for="(image, index) in selectedTree.images" :key="index">
            <img :src="image" class="overlay-img" alt="Tree Image" />
          </el-carousel-item>
        </el-carousel>
        <h3 class="tree-name">{{ selectedTree.name }}</h3>
        <div class="tree-info">
          <div class="tree-info-item">{{ selectedTree.shortDescription.split('，')[0] }}</div>
          <div class="tree-info-item">{{ selectedTree.shortDescription.split('，')[1] }}</div>
          <div class="tree-info-item">{{ selectedTree.shortDescription.split('，')[2] }}</div>
        </div>
        <p class="tree-description">{{ selectedTree.description }}</p>
      </el-card>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      trees: [
        {
          name: "金陵树王--银杏",
          images: ["/TreeImg/银杏树王-1.jpg", "/TreeImg/银杏树王-2.jpg", "/TreeImg/银杏树王-3.jpg"],
          shortDescription: "位置：浦口区汤泉街道古惠济寺，坐标：E118°30′34″、N32°05′58″，树龄：1500",
          description: "南京浦口区惠济寺中的千年银杏，见过南朝帝王太子，听过北宋词人诵咏，沾染过近代书法家林散之的笔墨，时光中它缄默着，沐浴无数朝代风雨，迎接年年清风花月。这株银杏因树干高入云天，树叶遮天盖地，得名“撑天覆地”，相传为南朝梁昭明太子萧统亲手种植，如今已过1500岁，树高约29米，冠幅约21米，胸径约275厘米，编入南京古树名木489号，列为“金陵十大树王”之一。",
        },
        {
          name: "金陵树王--雪松",
          images: ["/TreeImg/雪松树王-1.jpg", "/TreeImg/雪松树王-2.jpg", "/TreeImg/雪松树王-3.jpg", "/TreeImg/雪松树王-4.jpg"],
          shortDescription: "位置：玄武区中山陵“天下为公”陵门，坐标：E118°50′56″、N32°03′52″，树龄：102",
          description: "雪松为南京市树。雪松树王胸径128厘米，树高20米，冠幅9米，枝下高2.4米，树龄102年。" +
            "南京自1920年代开始引种雪松，民国时期和新中国成立初期种植较多。孙中山先生作为伟大的民族英雄、中国民主革命的伟大先驱，一生追求“天下为公”，先生已逝，但如松树一般的伟岸身躯却开启了中国近代革命的新篇章。",
        },
        {
          name: "金陵树王--墨西哥落羽杉",
          images: ["/TreeImg/墨西哥落羽杉树王-1.jpg", "/TreeImg/墨西哥落羽杉树王-3.jpg"],
          shortDescription: "位置：玄武区东南大学四牌楼校区健雄院楼前，坐标：E118°47′21″、N32°03′26″，树龄：116",
          description: "墨西哥落羽杉为外来常绿或半常绿大乔木，在原产地高可达50米，胸径4米。树干尖削度大，基部膨大，树皮裂成长条片脱落。枝条水平开展，形成宽圆锥形树冠，大树的小枝微下垂。长有叶的侧生小枝螺旋状散生。叶呈条形，扁平，排列紧密，列成二列，呈羽状，通常在一个平面上，长约1厘米，宽1毫米，向上逐渐变短。雄球花呈卵圆形，近无梗，组成圆锥花序状。球果呈卵圆形，直径1.5~2.5厘米，生有白粉。在其原产地，墨西哥落羽杉秋季开花。引种至江苏南京后，墨西哥落羽杉变为春季开花，但不能正常结实。墨西哥落羽杉树王位于江苏省南京市玄武区东南大学四牌楼校区健雄院楼前（北纬32°03′26″，东经118°47′21″）。树木胸径164厘米，树高18米，冠幅23米，枝下高2.5米；树龄116年，健康状况良好。墨西哥落羽杉树王因生长在东南大学健雄院一侧，又被称为“健雄魂”，是目前我国现存最早、最大的墨西哥落羽杉",
        },
        {
          name: "金陵树王--朴树",
          images: ["/TreeImg/朴树树王-1.jpg", "/TreeImg/朴树树王-2.jpg", "/TreeImg/朴树树王-3.jpg"],
          shortDescription: "位置：玄武区明孝陵文武方门内，坐标：E118°50′02″、N32°03′25″，树龄：122",
          description: "位于明孝陵文武方门内的这棵朴树是景区朴树树龄最长的元老，树龄已有120多年，现场测量数据显示，胸围达4米，沧桑但茂盛，见证历史、经历炮火、岁月沧桑、屹立不倒，带来生命的感动和历史的厚重，是名副其实的“活文物”。",
        },
        {
          name: "金陵树王--圆柏",
          images: ["/TreeImg/圆柏树王-1.jpg", "/TreeImg/圆柏树王-2.jpg", "/TreeImg/圆柏树王-3.jpg"],
          shortDescription: "位置：玄武区东南大学四牌楼校区，坐标：E118°47′29″、N32°03′26″，树龄：1520",
          description: "东南大学四牌楼校区内有一株树龄为1513岁的桧柏，相传为六朝遗物，系梁武帝亲手种植，俗称“六朝松”。栉风沐雨，霜干虬枝，见证了校园的百年发展之路，更传承了南京千年文脉的源远流长。"
            + "六朝松高12米，冠幅7米，胸围达310厘米，被编入南京古树名木053号，并获评2022年“金陵十大树王”之一，树龄约1500年，堪称南京古树中的“活化石”。光阴荏苒，时光如梭。六朝松在风雨中幸存至今，像一位智慧的长者，沐浴着千年文韵，嗅着四季墨香，静静倾听着城市的历史。",
        },
        {
          name: "金陵树王--二球悬铃木",
          images: ["/TreeImg/二球悬铃木树王-1.jpg", "/TreeImg/bodyShowBg.png"],
          shortDescription: "位置：鼓楼区大锏银巷，坐标：E118°46′21″、N32°02′44″，树龄：122",
          description: "悬铃木科悬铃木属二球悬铃木，被誉为“行道树之王”。这棵悬铃木，胸径134厘米，树高20米，冠幅14米，枝下高1.8米，树龄122年。"
            + "悬铃木树王树龄虽已双甲子，但依然生长健壮，树形优美，冠大荫浓，枝条舒展，皮剥如片，叶展如掌，球果如铃。",
        },
        {
          name: "金陵树王--青檀",
          images: ["/TreeImg/青檀树王-1.jpg", "/TreeImg/青檀树王-2.jpg", "/TreeImg/青檀树王-3.jpg"],
          shortDescription: "位置：栖霞区燕子矶公园矶头，坐标：E118°48′43″、N32°08′54″，树龄：510",
          description: "榆科青檀属落叶乔木树种，中国特有的单种属，稀有类3级保护植物，因茎皮、枝皮纤维可制造书画宣纸而享誉盛名。燕子矶青檀王胸径51厘米，树高15米，冠幅8米，枝下高1.6米，树龄510年。"
            + "燕子矶的石灰岩特别适宜青檀生长，矶顶青檀仍处青壮年时期，树体形态皆为该树种的典型特征，见树王而识此树种也。",
        },
        {
          name: "金陵树王--香樟",
          images: ["/TreeImg/香樟树王-1.jpg", "/TreeImg/香樟树王-2.jpg", "/TreeImg/香樟树王-3.jpg"],
          shortDescription: "位置：鼓楼区南京大学礼堂旁，坐标：E118°46′32″、N32°03′30″，树龄：90",
          description: "在鼓楼校区闻名的大礼堂旁边，这棵树龄百年的香樟树倔强地生长着。满树的绿意扑面而来，不张扬，不浮夸；枝叶浓密，伟岸挺立；伞状的树冠荫浓，圆满如盖；蛐蛐盘旋的虬枝苍劲有力，裸露的树根犹如蛟龙的爪子紧紧抓住大地。树下立有石碑，据碑文记载，此树为1931年栽植，是南京市最早试种栽培的香樟树之一。",
        },
        {
          name: "金陵树王--桂花",
          images: ["/TreeImg/桂花树王-1.jpg", "/TreeImg/桂花树王-2.jpg", "/TreeImg/桂花树王-3.jpg"],
          shortDescription: "位置：玄武区灵谷寺景区，坐标：E118°51′42″、N32°03′28″，树龄：150",
          description: "桂花是木犀科木犀属众多树木的统称，可划分为金桂、银桂、丹桂、四季桂等4个类群。灵谷寺景区桂花王为“波叶金桂”，树高6米，冠幅10米，地径80厘米，树龄150年，被誉为“金陵桂花王”。",
        },
        {
          name: "金陵树王--榔榆",
          images: ["/TreeImg/榔榆树王-1.jpg", "/TreeImg/榔榆树王-2.jpg", "/TreeImg/榔榆树王-3.jpg"],
          shortDescription: "位置：高淳区淳溪街道铺头村，坐标：E118°55′13″、N31°20′52″，树龄：150",
          description: "榆科榆属落叶大乔木树种，树皮裂成不规则鳞状薄片剥落，露出红褐色内皮，南京市乡土树种，秋季色叶树种。“榔榆王”王胸径142厘米，树高13米，冠幅18米，枝下高1.6米，树龄约150年。"
            + "独自默默生长的榔榆树，起初并不被众人所关注，但现世即已为王，堪称华丽的转身，颇有养精蓄锐、厚积薄发之意。榔榆树周边的村庄皆已拆迁，树王也成为了村民怀念旧居的“坐标”",
        },
      ],
      selectedTree: null, // selected tree for detail view
    };
  },
  methods: {
    openDetailDialog(tree) {
      this.selectedTree = tree; // Set the selected tree for detail view
    },
  },
};
</script>

<style scoped>
.card-row {
  min-width: 1200px;
}

.tree-display {
  padding: 10px;
}

.page-title {
  text-align: center;
  margin-bottom: 30px;
  background: url('/images/bodyShowBg.png') no-repeat center top;
  background-size: cover;
  padding: 50px 0;
  background-position: center;
}

.page-title h1 {
  font-size: 56px;
  font-weight: bold;
  text-shadow: 3px 3px 8px rgba(0, 0, 0, 0.2);
  background: rgb(255, 255, 255);
  -webkit-background-clip: text;
  color: transparent;
  letter-spacing: 2px;
}

.card-container {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
}

.card-col {
  flex: 1 1 300px;
  margin-bottom: 15px;
}

.tree-card {
  cursor: pointer;
  transition: transform 0.3s ease;
  width: 100%;
  border: 1px solid rgba(0, 0, 0, 0.1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.38);
  border-radius: 10px;
}

.tree-card:hover {
  transform: scale(1.05);
}

.card-img {
  width: 100%;
  height: 150px;
  object-fit: cover;
  border-radius: 5px;
}

.card-body {
  padding: 10px;
}

.tree-name {
  font-size: 18px;
  font-weight: bold;
  display: flex;
  justify-content: center;
  align-items: center;
}

.tree-info {
  font-size: 14px;
  color: #888;
  display: block;
  margin-top: 10px;
}

.tree-info-item {
  margin-bottom: 5px;
}

.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.overlay-card {
  width: 50%;
  max-width: 700px;
  padding: 20px;
  border-radius: 8px;
}

.overlay-img {
  width: 100%;
  height: 300px;
  object-fit: cover;
}

.tree-description {
  margin-top: 20px;
  font-size: 16px;
  color: #333;
}
</style>
