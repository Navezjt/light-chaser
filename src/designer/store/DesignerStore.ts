import {makeAutoObservable, runInAction, toJS} from "mobx";
import * as _ from "lodash";
import {Layout} from "react-grid-layout";
import {
    ActiveElem,
    BackgroundColorMode,
    BackgroundConfig,
    BackgroundImgRepeat,
    BackgroundMode,
    CanvasConfig,
    ElemConfig,
    Layer,
    LCDesigner,
    LcLayout,
    ProjectConfig,
    ProjectState,
    SaveType,
    Statistic,
    Theme
} from "../../framework/types/DesignerType";
import bootCore from "../BootCore";
import BaseStore from "../../framework/interface/BaseStore";
import rightStore from "../right/RightStore";

class DesignerStore implements LCDesigner, BaseStore {
    constructor() {
        makeAutoObservable(this);
    }

    /**
     * 大屏id
     */
    id: number = -1;

    /**
     * 画布设置
     */
    canvasConfig: CanvasConfig = {
        interval: 0,  //元素间距
        columns: 192,  //画布列总数
        baseHeight: 0,  //元素单位高度
        scale: 1,  //画布缩放比例
        width: 1920,  //画布宽
        height: 1080,  //画布高
    };

    /**
     * 激活状态属性
     */
    activeElem: ActiveElem = {
        id: -999, //元素id
        type: '' //元素类型
    };

    /**
     * 项目设置
     */
    projectConfig: ProjectConfig = {
        name: '',//项目名称
        des: '',//项目描述
        state: ProjectState.DRAFT,//项目状态
        createTime: '',//创建时间
        updateTime: '',//更新时间
        elemCount: 0,//元素个数
        saveType: SaveType.LOCAL,//存储类型
    };

    /**
     * 组件配置
     */
    elemConfigs: { [key: string]: ElemConfig } = {
        '-1': {
            'background': {
                width: 1920,//背景宽
                height: 1080,//背景高
                bgMode: BackgroundMode.NONE,//背景模式
                bgImgSize: [1920, 1080],//背景图片尺寸
                bgImgPos: [0, 0],//背景图片位置
                bgImgRepeat: BackgroundImgRepeat.NO_REPEAT,//背景图片重复方式
                bgImgUrl: '',//背景图片url地址
                bgColorMode: BackgroundColorMode.SINGLE,//背景图片颜色模式
                bgColor: '#040d18',//背景颜色
                colors: ['#000000', '#000000'],//颜色数组（用于处理渐变色配置的数据回显）
                angle: 0,//渐变角度
            }
        },
    };

    /**
     * 布局配置
     */
    layoutConfigs: any = [];

    /**
     * 统计信息
     */
    statisticInfo: Statistic = {
        //元素个数
        count: 0,
    };

    /**
     * 图层信息
     */
    layers: Layer[] = [];

    /**
     * 主题
     */
    theme: Theme = {};

    /**
     * 编组
     */
    group: any = undefined;

    /**
     * 联动配置
     */
    linkage: any = undefined;

    /**
     * 条件配置
     */
    condition: any = undefined;

    /**
     * 扩展参数
     */
    extendParams: any = undefined;


    /**
     * 初始化store
     */
    doInit = (store: LCDesigner) => {
        this.id = store.id ?? this.id;
        this.canvasConfig = store.canvasConfig ? {...this.canvasConfig, ...store.canvasConfig} : this.canvasConfig;
        this.projectConfig = store.projectConfig ? {...this.projectConfig, ...store.projectConfig} : this.projectConfig;
        this.elemConfigs = store.elemConfigs ? {...this.elemConfigs, ...store.elemConfigs} : this.elemConfigs;
        this.layoutConfigs = store.layoutConfigs || this.layoutConfigs;
        this.statisticInfo = store.statisticInfo ? {...this.statisticInfo, ...store.statisticInfo} : this.statisticInfo;
        this.layers = store.layers || this.layers;
        this.theme = store.theme || this.theme;
        this.group = store.group || this.group;
        this.linkage = store.linkage || this.linkage;
        this.condition = store.condition || this.condition;
        this.extendParams = store.extendParams ? {...this.extendParams, ...store.extendParams} : this.extendParams;
        this.updateActive({id: -1, type: 'LcBg'});
    }

    getData(): any {
        return {
            id: this.id,
            canvasConfig: toJS(this.canvasConfig),
            activeElem: toJS(this.activeElem),
            projectConfig: toJS(this.projectConfig),
            elemConfigs: toJS(this.elemConfigs),
            layoutConfigs: toJS(this.layoutConfigs),
            statisticInfo: toJS(this.statisticInfo),
            layers: toJS(this.layers),
            theme: toJS(this.theme),
            group: toJS(this.group),
            linkage: toJS(this.linkage),
            condition: toJS(this.condition),
            extendParams: toJS(this.extendParams),
        }
    }

    /**
     * 清空store
     */
    doDestroy = () => {
        this.id = -1;
        this.canvasConfig = {};
        this.activeElem = {};
        this.projectConfig = {};
        this.elemConfigs = {};
        this.layoutConfigs = [];
        this.statisticInfo = {};
        this.layers = [];
        this.theme = {};
        this.group = {};
        this.linkage = {};
        this.condition = {};
        this.extendParams = {};
    }


    /**
     * 设置布局id
     */
    setId = (id: number) => {
        runInAction(() => {
            this.id = id;
        })
    }

    /**
     * 设置图表配置
     */
    setChartConfigs = (elemConfigs: { [key: string]: ElemConfig }) => {
        runInAction(() => {
            this.elemConfigs = elemConfigs;
        });
    }

    /**
     * 设置布局配置
     */
    setLayoutConfigs = (layoutConfigs: LcLayout[]) => {
        runInAction(() => {
            this.layoutConfigs = layoutConfigs;
        })
    }

    /**
     * 设置扩展临时属性
     */
    setExtendParams = (extendParams: any) => this.extendParams = extendParams;

    getActiveElemConfig = (activeId: number | string) => {
        if (activeId)
            return this.elemConfigs[activeId + ""];
    }

    /**
     * 添加元素
     */
    addItem = (item: LcLayout) => {
        this.layoutConfigs?.push(item);
        const {loaded, autoCompObjs} = bootCore;
        if (!loaded) return;
        let initObj: any = autoCompObjs[item.compKey];
        let initData: any = initObj.getInitConfig()
        initData.info = {...initData.info, ...{id: this.statisticInfo?.count}}
        if (this.elemConfigs && this.statisticInfo)
            this.elemConfigs[this.statisticInfo.count + ""] = initData;
        let {count = 0} = this.statisticInfo!;
        if (this.statisticInfo) {
            count++;
            this.statisticInfo.count = count;
        }
    }

    /**
     * 删除元素
     */
    delItem = (id: string | number) => {
        _.remove(this.layoutConfigs, function (item: any) {
            return item?.id === id;
        })
        delete this.elemConfigs[id + ''];
        if (this.activeElem && id === this.activeElem.id) {
            this.activeElem.id = -1;
            this.activeElem.type = "";
        }
    }

    /**
     * 更新布局
     */
    updateLayout = (item: Layout) => {
        const {i, x, y, w, h} = item;
        for (let index = 0; index < this.layoutConfigs.length; index++) {
            if (this.layoutConfigs[index].i === i) {
                this.layoutConfigs[index] = {...this.layoutConfigs[index], ...{x, y, w, h}}
                break;
            }
        }
    }

    /**
     * 更新激活状态元素
     */
    updateActive = (data: ActiveElem) => {
        if (data.id === this.activeElem.id)
            return;
        this.activeElem = {...this.activeElem, ...data};
        const {updateMenus} = rightStore;
        updateMenus(this.activeElem);
    }

    /**
     * 更新组件基础样式
     */
    updateBaseStyle = (data: any) => {
        const {id} = this.activeElem!;
        let charConfig = this.elemConfigs[id + ''];
        let baseConfig = charConfig?.baseStyle;
        if (charConfig && baseConfig)
            charConfig.baseStyle = {...baseConfig, ...data};
    }

    /**
     * 更新图表组件配置
     */
    updateElemConfig = (data: any) => {
        let activeConfig: ElemConfig | any = this.elemConfigs[this.activeElem?.id + ''];
        if (activeConfig) {
            this.elemConfigs[this.activeElem?.id + ''] = _.merge({}, activeConfig, data);
            const {setActiveElemConfig} = rightStore;
            setActiveElemConfig(this.elemConfigs[this.activeElem?.id + '']);
        }
    }

    /**
     * 更新基础信息
     */
    updateBaseInfo = (data: any) => {
        let {id = -1} = this.activeElem;
        let chartConfig: ElemConfig = this.elemConfigs[id];
        if (chartConfig)
            chartConfig.baseInfo = {...chartConfig.baseInfo, ...data};
    }

    /**
     * 更新画布设置
     */
    updateCanvasConfig = (data: CanvasConfig) => {
        runInAction(() => {
            this.canvasConfig = {...this.canvasConfig, ...data};
        })
    }

    /**
     * 更新项目配置
     */
    updateProjectConfig = (data: ProjectConfig) => {

        runInAction(() => {
            this.projectConfig = {...this.projectConfig, ...data};
        })
    }

    /**
     * 更新背景配置
     */
    updateBgConfig = (data: BackgroundConfig) => {
        let oldConfig = this.elemConfigs['-1']['background'];
        this.elemConfigs['-1']['background'] = {...oldConfig, ...data};
        console.log(toJS(this.elemConfigs))
    }

    /**
     * 更新系统配置
     */
    updateSystemConfig = () => {

    }
}

const designerStore = new DesignerStore();

export default designerStore;
export {
    DesignerStore
};