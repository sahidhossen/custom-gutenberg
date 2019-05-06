import React, { Component } from 'react';

// Importing domReady and editPost modules
import { data, editPost, domReady } from '@frontkom/gutenberg-js';

// Don't forget to import the style
import '@frontkom/gutenberg-js/build/css/block-library/style.css';
import '@frontkom/gutenberg-js/build/css/style.css';

class Editor extends Component {
    componentDidMount () {
        // Some editor settings
        const settings = {
            alignWide: true,
            availableTemplates: [],
            allowedBlockTypes: true,
            disableCustomColors: false,
            disableCustomFontSizes: false,
            disablePostFormats: false,
            titlePlaceholder: "Add title",
            bodyPlaceholder: "Write your story",
            isRTL: false,
            autosaveInterval: 10,
            styles: [],
            postLock: {
                isLocked: false,
            },
            // @frontkom/gutenberg-js settings
            canAutosave: false,  // to disable the Editor Autosave feature (default: true)
            canPublish: false,   // to disable the Editor Publish feature (default: true)
            canSave: false,      // to disable the Editor Save feature (default: true)
            mediaLibrary: false, // to disable the Media Library feature (default: true)
        };

        // Post properties to override
        const overridePost = {};
          // reset localStorage
        localStorage.removeItem('g-editor-page');

        // Disable tips
        data.dispatch('core/nux').disableTips();

        // Initialize the editor
        window._wpLoadGutenbergEditor = new Promise(function (resolve) {
            domReady(function () {
                resolve(editPost.initializeEditor('editor', 'page', 1, settings, overridePost));
            });
        });
    }
    render(){
        return <div id="editor" className="gutenberg__editor"></div>;
    }
}
export default Editor
