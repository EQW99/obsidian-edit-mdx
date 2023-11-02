import {Plugin, normalizePath } from 'obsidian';
import * as fs from "fs";

export default class MdxTools extends Plugin {

	async onload() {
		super.onload()

		this.registerExtensions(["mdx"], "markdown");
		
		this.addRibbonIcon('add-note-glyph', 'New .mdx file', (evt: MouseEvent) => {
			this.createMDX()
		});

		this.registerEvent(
			this.app.workspace.on("file-menu", (menu, file) => {
				menu.addItem((item) => {
					item
					.setTitle("New .mdx file")
					.setIcon("add-note-glyph")
					.onClick(async () => {
						let folder : string
						const fname = file.path
						if( fname.search("(\\.[^.]+)$") > 0 ) {
							folder = file.parent.path
						} else {
							folder = fname
						}
						this.createMDX(folder)
					});
				});
			})
		);

	}

	onunload() {

	}

	checkExists(filepath : string) {
		return app.vault.getAbstractFileByPath(filepath) && true;
	}

	// Create new MDX file
	createMDX(folder? : string) {
		if ( !folder ) {
			folder = this.app.fileManager.getNewFileParent(app.workspace.getActiveFile()?.path || '').path
		}
		
		let filename = normalizePath(folder + "/Untitled.mdx")
		console.log(filename)

		if (!this.checkExists(filename)) {
			console.log("no exist")
			this.app.vault.create(filename, "")
		} 
		else { // If Untitled.mdx already exists, try Untitled 1.mdx etc
			let iter = 0
			console.log("else")
			while (true) {
				iter = iter + 1
				filename = normalizePath(folder + "/Untitled " + iter + ".mdx")
				if (!this.checkExists(filename)) {
					this.app.vault.create(filename, "")
					break
				}
			}
		}


	}
}

