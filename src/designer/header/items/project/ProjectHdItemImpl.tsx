import {FormEvent, useRef} from 'react';
import Dialog from "../../../../json-schema/ui/dialog/Dialog";
import headerStore from "../../HeaderStore";
import './ProjectHdItemImpl.less';
import designerStore from "../../../store/DesignerStore";
import {IProjectInfo, ProjectState} from "../../../DesignerType";
import {Grid} from "../../../../json-schema/ui/grid/Grid";
import Input from "../../../../json-schema/ui/input/Input";
import Radio from "../../../../json-schema/ui/radio/Radio";
import Select from "../../../../json-schema/ui/select/Select";
import Button from "../../../../json-schema/ui/button/Button";


const ProjectHdItemImpl = () => {
    const configRef = useRef<IProjectInfo | null>({...designerStore.projectConfig});
    const {projectVisible} = headerStore;
    const {name, des, state, saveType} = configRef.current!;

    const onClose = () => headerStore.setProjectVisible(false);

    const doSave = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const {updateProjectConfig} = designerStore;
        updateProjectConfig(configRef.current!);
        onClose();
    }

    return (
        <Dialog title={'项目设置'} className={'lc-header-project-set'} visible={projectVisible}
                onClose={onClose}>
            <form onSubmit={doSave}>
                <div style={{display: 'flex', flexWrap: 'wrap'}}>
                    <Grid gridGap={'15px'} columns={2}>
                        <Input label={'项目名称'} maxLength={20} defaultValue={name}
                               onChange={(name) => configRef.current!.name = name}/>
                        <Input label={'项目描述'} maxLength={60} defaultValue={des}
                               onChange={(des) => configRef.current!.des = des}/>
                        <Radio label={'项目状态'} onChange={value => configRef.current!.state = value as ProjectState}
                               containerStyle={{gridColumn: '1/3'}}
                               defaultValue={state}
                               options={[
                                   {label: '草稿', value: ProjectState.DRAFT},
                                   {label: '发布', value: ProjectState.PUBLISH},
                                   {label: '封存', value: ProjectState.SEALED}
                               ]}/>
                        <Select label={'存储类型'} options={[{value: '1', label: '本地存储'}]}
                                defaultValue={saveType}/>
                    </Grid>

                </div>
                <div className={'lc-header-project-footer'}>
                    <Button type={'submit'}>保存</Button>
                    <Button type={'button'} onClick={onClose}>取消</Button>
                </div>
            </form>
        </Dialog>
    );
}

export default ProjectHdItemImpl;