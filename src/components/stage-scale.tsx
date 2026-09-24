"use client";

import { useEffect } from "react";

/**
 * Sizes every drawn board (.suite-board) to its stage: --stage-scale is the
 * stage's width over the board's own (--stage-w).
 *
 * CSS used to do this alone, with scale(tan(atan2(100cqw, var(--stage-w)))).
 * Safari gets that wrong: with a container unit in it the angle comes back in
 * the wrong unit, so a board that should draw at 0.2 drew at -3.4 (flipped and
 * off the stage) and a 0.8 one at 8.7 — on an iPhone the campaign, suite and
 * funnel drawings showed as blank space. So the number is measured here, for
 * every browser; until it is, globals.css leaves the board undrawn.
 *
 * One observer for the whole document, including boards that mount later (the
 * hero's product screens come and go) and let go of the ones that leave.
 */
export function StageScale() {
  useEffect(() => {
    const boards = new WeakMap<Element, HTMLElement>(); // stage → its board

    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const board = boards.get(entry.target);
        const w = board ? parseFloat(board.style.getPropertyValue("--stage-w")) : 0;
        if (board && w) board.style.setProperty("--stage-scale", String(entry.contentRect.width / w));
      }
    });

    const boardsIn = (node: Node) =>
      node instanceof Element
        ? [...(node.matches(".suite-board") ? [node] : []), ...node.querySelectorAll(".suite-board")]
        : [];

    const add = (node: Node) =>
      boardsIn(node).forEach((board) => {
        const stage = board.parentElement;
        if (!stage) return;
        boards.set(stage, board as HTMLElement);
        ro.observe(stage); // a no-op for a stage already observed
      });

    const remove = (node: Node) =>
      boardsIn(node).forEach((board) => board.parentElement && ro.unobserve(board.parentElement));

    add(document.body);
    const mo = new MutationObserver((records) => {
      for (const record of records) {
        record.addedNodes.forEach(add);
        record.removedNodes.forEach(remove);
      }
    });
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      mo.disconnect();
      ro.disconnect();
    };
  }, []);

  return null;
}
