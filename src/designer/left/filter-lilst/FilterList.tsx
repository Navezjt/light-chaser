import './FilterList.less';
import {MinusOutlined, PlusOutlined, QuestionCircleOutlined} from "@ant-design/icons";
import designerLeftStore from "../DesignerLeftStore.ts";
import eventOperateStore from "../../operate-provider/EventOperateStore.ts";
import {observer} from "mobx-react";
import filterManager from "../../manager/FilterManager.ts";
import AddFilterDialog from "./AddFilterDialog.tsx";
import {Popconfirm} from "antd";

export const FilterList = observer(() => {
    const {filters, setEditFilter, delFilter, setVisibility} = filterManager;

    return <>
        <div className={'dl-filter-list'}>
            <div className={'dl-fl-header'}>
                <div>全局过滤器</div>
                <div>
                    <PlusOutlined onClick={() => setVisibility(true)}/>
                    &nbsp;&nbsp;
                    <MinusOutlined onClick={() => {
                        const {setMenu} = designerLeftStore;
                        setMenu("");
                        const {rulerRef} = eventOperateStore;
                        rulerRef?.ruleWheel();
                    }}/>
                </div>
            </div>
            <div className={'dl-fl-body'}>
                {
                    Object.values(filters).map((filter) => {
                        return <div className={'filter-item'} key={filter.id}>
                            <div className={'filter-name'}>{filter.name}</div>
                            <div className={'filter-operate'}>
                                <span onClick={() => {
                                    setEditFilter(filter);
                                    setVisibility(true);
                                }}>编辑</span>
                                &nbsp;&nbsp;
                                <Popconfirm title="提示信息"
                                            icon={<QuestionCircleOutlined style={{color: 'red'}}/>}
                                            description="删除后无法撤销，确认删除嘛？"
                                            onConfirm={() => delFilter(filter.id)}
                                            okText="是"
                                            cancelText="否">
                                    <span>删除</span>
                                </Popconfirm>
                            </div>
                        </div>
                    })
                }
            </div>
        </div>
        {filterManager.visible && <AddFilterDialog/>}
    </>
})
