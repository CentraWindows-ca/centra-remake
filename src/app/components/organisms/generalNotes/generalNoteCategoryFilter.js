import { Tag } from "antd";
import { mapNoteCategoryToKey } from "app/utils/utils";

export default function GeneralNoteCategoryFilter(props) {
    const {notes, noteCategories, selectedCategory, handleSelectCategoryFilter, disabled} = props;

    let categories = Object.entries(noteCategories).map((e) => {
        return { key: e[0], value: e[1].label, color: e[1].color }
    });

    return (
        <div className="flex space-x-2">
            <div>Show:</div>
            <Tag 
                className={`${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                color={selectedCategory === "All" ? 'blue' : ''} 
                onClick={disabled ? null : ()=>handleSelectCategoryFilter("All")}>{`All (${notes.length})`}
            </Tag>
            { categories.map(_c=>{
                var _cCount = notes.filter(_n=>mapNoteCategoryToKey(_n.category) === _c.key).length;

                if (_cCount > 0) {
                    return (
                        <Tag
                            className={`${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                            color={selectedCategory === _c.key ? 'blue' : ''}
                            key={`catFilter_${_c.key}`} 
                             onClick={disabled ? null : ()=>handleSelectCategoryFilter(_c.key)}>{`${_c.value} (${_cCount})`}
                        </Tag>
                    )
                }
            })}
        </div>
    )
}
