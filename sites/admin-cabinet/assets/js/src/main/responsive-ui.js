/*
 * MikoPBX - free phone system for small business
 * Copyright (C) 2017-2023 Alexey Portnov and Nikolay Beketov
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License along with this program.
 * If not, see <https://www.gnu.org/licenses/>.
 */
const responsive = {
    $sidebar: $('#sidebar-menu'),
    $sidebarMenuButton: $('#sidebar-menu-button'),
    $hideOnMobileElements: $('.hide-on-mobile'),
    initialize() {
        responsive.$sidebar.sidebar('setting', 'transition', 'overlay');
        responsive.$sidebar.sidebar('attach events', '#sidebar-menu-button');
        window.addEventListener('resize', responsive.toggleSidebar);
        responsive.toggleSidebar();
    },
    toggleSidebar()
    {
        if (window.innerWidth <= 768) {
            responsive.$sidebar.sidebar('hide');
            responsive.$sidebarMenuButton.show();
            responsive.$hideOnMobileElements.hide();
        } else {
            responsive.$sidebar.sidebar('show');
            responsive.$sidebarMenuButton.hide();
            responsive.$hideOnMobileElements.show();
        }
    }
}

// attach ready event
$(document).ready(() => {
    responsive.initialize();
});
